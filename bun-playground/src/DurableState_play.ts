import { setTimeout } from "timers/promises";
import {
  DurableState,
  type ContinueTrigger,
  type ExeOpt,
  type StepHandler,
  type StepIt,
} from "./DurableState";
enum EStep {
  step_begin = "step_begin",
  step_1 = "step_1",
  step_2 = "step_2",
  step_3 = "step_3",
  step_end = "step_end",
}

class DurableStateDemo extends DurableState<EStep> {
  // Type Safeguard & Auto register
  private _static(key: EStep): StepHandler<EStep> {
    return this[key];
  }
  private _collectAndRegisterSteps() {
    Object.values(EStep).map((step) =>
      this.stepHandler.set(step, this._static(step).bind(this))
    );
  }

  constructor(defaultStep: EStep) {
    super(defaultStep);
    this._collectAndRegisterSteps();
  }

  async *step_begin(ins: DurableState<EStep>, opt?: ExeOpt): StepIt<EStep> {
    this.step = EStep.step_1;
    yield { canContinue: true, needSave: true, activeStep: this.step };
    return { nextStep: this.step };
  }

  async *step_1(ins: DurableState<EStep>, opt?: ExeOpt): StepIt<EStep> {
    // wait for 500ms
    yield this.pauseAndResumeAfterMs("wait_for_500ms", 500);
    console.log("after 500ms since start");

    yield this.pauseAndResumeAfterMs("wait_for_1000ms", 1000);
    console.log("after 1500ms since start. move next");

    // Move to step 2
    this.step = EStep.step_2;
    yield { canContinue: true, needSave: true, activeStep: this.step };

    return { nextStep: this.step };
  }

  async *step_2(ins: DurableState<EStep>, opt?: ExeOpt): StepIt<EStep> {
    // Do something
    // Move to step end

    let count = 1;
    for (let i = 0; i < 3; i++) {
      count += await this.withDurableAction(
        `${i}`,
        () => {
          const res = (100 + i) ** (2 + i);
          console.log("\t", "Do heavy calculation", i, "->", res);
          return res;
        },
        opt
      );

      this.state["count"] = count;
      yield {
        canContinue: true,
        needSave: false,
        activeStep: this.step,
      };
    }
    console.log("\t", "work done");
    this.step = EStep.step_3;
    yield { canContinue: true, needSave: true, activeStep: this.step };

    return { nextStep: this.step };
  }

  async *step_3(ins: DurableState<EStep>, opt?: ExeOpt): StepIt<EStep> {
    const { it, responsePayload } = this.pasueAndResumeOnEvent(
      "ask_for_confirm",
      `count=${this.state["count"]} is it ok  y / n ?`
    );
    yield it;
    console.log("after event. got data", responsePayload);
    this.state["isApproved"] = responsePayload === "y";

    this.step = EStep.step_end;
    return { nextStep: this.step };
  }

  async *step_end(ins: DurableState<EStep>, opt?: ExeOpt): StepIt<EStep> {
    // nothing to do
    return { nextStep: null };
  }
}

async function main() {
  let ins = new DurableStateDemo(EStep.step_begin);

  let preData: any = null;
  let finalValue: any = null;
  let count = 1;

  while (!finalValue) {
    console.log("----------------------------");
    console.log("Run", count++);
    console.log("----------------------------");
    let maxIter = 5;
    {
      if (preData) {
        // force re-construct
        ins = DurableStateDemo.fromJSON<EStep, DurableStateDemo>(
          DurableStateDemo,
          preData
        );
      }
      const res = await runtimeRun(ins, maxIter);

      // save to db somehow
      preData = res.saveData;
      finalValue = res.finalValue;

      // handle resume
      if (res.resumeTrigger)
        await runtimeHandleContinueTrigger(ins, res.resumeTrigger);
    }
  }
  console.log("finalData:", ins.toJSON());
  console.log("finalValue:", finalValue);
}
main();

async function runtimeRun(ins: DurableState<EStep>, maxIter: number) {
  let work = ins.exec();
  let it = await work.next();
  let resumeTrigger;
  let saveData = null;
  let finalValue = null;
  while (!it.done) {
    it = await work.next();
    console.log("it:", --maxIter, "->", it);
    if (!it.done && it.value.canContinue === false) {
      // pause and register resume
      resumeTrigger = it.value.resumeTrigger;
      break;
    }
    if (maxIter <= 0) break;
  }
  if (!it.done) {
    console.log("not done");
    console.log("resumeTrigger:", resumeTrigger);
    saveData = ins.toJSON();
    console.log("saved data:", saveData);
  } else {
    finalValue = it.value;
  }

  return { saveData, finalValue, resumeTrigger };
}

async function runtimeHandleContinueTrigger(
  ins: DurableState<EStep>,
  resumeTrigger: ContinueTrigger
) {
  if (resumeTrigger.type === "time") {
    const needToSleep = resumeTrigger.resumeAt - Date.now();
    console.log(`Handle resumeTrigger -> sleep ${needToSleep} `);
    await setTimeout(needToSleep);
    return;
  } else if (resumeTrigger.type === "event") {
    // Simulate event waiting by asking input

    const entry = ins.getResume(resumeTrigger.resumeId);
    if (entry?.type !== "event") throw new Error(`invalid type ${entry?.type}`);
    const ans = prompt(
      `Question for - "${resumeTrigger.resumeId} - data "${entry.requestPayload}"`
    );
    ins.resolveResume(resumeTrigger.resumeId, ans);
    return;
  } else {
    throw new Error(`unknown resume trigger ${resumeTrigger}`);
  }
}