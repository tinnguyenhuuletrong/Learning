import { setTimeout } from "timers/promises";
import {
  DurableState,
  type ContinueTrigger,
  type DurableStateOpt,
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
type StateShape = Partial<{
  count: number;
  isApproved: boolean;
}>;
type ExtAuditLogType = "custom_msg_1" | "custom_msg_2";

class DurableStateDemo extends DurableState<
  EStep,
  StateShape,
  ExtAuditLogType
> {
  // Type Safeguard & Auto register
  private _static(key: EStep): StepHandler<EStep> {
    return this[key];
  }
  private _collectAndRegisterSteps() {
    Object.values(EStep).map((step) =>
      this.stepHandler.set(step, this._static(step).bind(this))
    );
  }

  constructor(defaultStep: EStep, opt?: DurableStateOpt) {
    super(defaultStep, opt);
    this._collectAndRegisterSteps();
  }

  private async *step_begin(opt?: ExeOpt): StepIt<EStep> {
    this.addLog({
      type: "custom_msg_1",
      values: {
        customVal: 1,
      },
    });
    return { nextStep: EStep.step_1 };
  }

  private async *step_1(opt?: ExeOpt): StepIt<EStep> {
    // wait for 500ms
    yield this.pauseAndResumeAfterMs("wait_for_500ms", 500);
    console.log("after 500ms since start");

    yield this.pauseAndResumeAfterMs("wait_for_1000ms", 1000);
    console.log("after 1500ms since start. move next");

    // Move to step 2
    yield { canContinue: true, needSave: true, activeStep: this.currentStep };

    return { nextStep: EStep.step_2 };
  }

  private async *step_2(opt?: ExeOpt): StepIt<EStep> {
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

      this.state.count = count;
      yield {
        canContinue: true,
        needSave: false,
        activeStep: this.currentStep,
      };
    }
    console.log("\t", "work done");
    yield { canContinue: true, needSave: true, activeStep: this.currentStep };

    return { nextStep: EStep.step_3 };
  }

  private async *step_3(opt?: ExeOpt): StepIt<EStep> {
    const { it, responsePayload } = this.pasueAndResumeOnEvent(
      "ask_for_confirm",
      `count=${this.state["count"]} is it ok  y / n ?`
    );
    yield it;
    console.log("after event. got data", responsePayload);
    this.state.isApproved = responsePayload === "y";

    return { nextStep: EStep.step_end };
  }

  private async *step_end(opt?: ExeOpt): StepIt<EStep> {
    // nothing to do
    this.addLog({
      type: "custom_msg_2",
      values: {
        customVal: 2,
      },
    });
    return { nextStep: null };
  }
}

async function main() {
  const opt: DurableStateOpt = { withAuditLog: true };
  let ins = new DurableStateDemo(EStep.step_begin, opt);

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
        ins = DurableState.fromJSON<
          EStep,
          StateShape,
          ExtAuditLogType,
          DurableStateDemo
        >(DurableStateDemo, preData, opt);
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

async function runtimeRun(ins: DurableStateDemo, maxIter: number) {
  let it;
  let resumeTrigger;
  let saveData = null;
  let finalValue = null;
  const work = ins.exec();
  while (maxIter > 0) {
    it = await work.next();
    console.log("it:", --maxIter, "->", it);
    if (!it.done && it.value.canContinue === false) {
      // pause and register resume
      resumeTrigger = it.value.resumeTrigger;
      break;
    } else if (it.done) {
      finalValue = it.value;
      break;
    }
  }
  if (!it) throw new Error("something wrong here. it should not be reached");
  if (!it.done) {
    console.log("not done");
    console.log("resumeTrigger:", resumeTrigger);
    saveData = ins.toJSON();
    // console.log("saved data:", saveData);

    // terminate not done work
    // prevent memory leak
    work.return(null);
  }

  return { saveData, finalValue, resumeTrigger };
}

async function runtimeHandleContinueTrigger(
  ins: DurableStateDemo,
  resumeTrigger: ContinueTrigger
) {
  if (resumeTrigger.type === "time") {
    const entry = ins.getResume(resumeTrigger.resumeId);
    if (entry?.type !== "timer") throw new Error(`invalid type ${entry?.type}`);
    const needToSleep = resumeTrigger.resumeAt - Date.now();
    console.log(`Handle resumeTrigger -> sleep ${needToSleep} `);
    await setTimeout(needToSleep);

    ins.resolveResume(resumeTrigger.resumeId);
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
