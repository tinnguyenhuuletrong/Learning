import { setTimeout } from "timers/promises";
enum EStep {
  step_begin = "step_begin",
  step_1 = "step_1",
  step_2 = "step_2",
  step_end = "step_end",
}
type ContinueTrigger = {
  type: "time";
  resumeAt: number;
};
type DurableStateIterator = {
  canContinue: boolean;
  needSave: boolean;
  activeStep: EStep;
  resumeTrigger?: ContinueTrigger;
};
type DurableStateReturn = {
  isEnd: boolean;
  finalState: Record<string, any>;
  waitFor?: any;
};
type ExeOpt = {
  ignoreCache: boolean;
};

class DurableState {
  step!: EStep;
  private state: Record<string, any> = {};
  private cache: Record<string, any> = {};

  async *exec(
    opt?: ExeOpt
  ): AsyncIterator<DurableStateIterator, DurableStateReturn> {
    let hasNext = true;

    while (hasNext) {
      switch (this.step) {
        case EStep.step_begin: {
          // Do something
          // Move to step 1

          this.step = EStep.step_1;
          yield { canContinue: true, needSave: true, activeStep: this.step };
          break;
        }
        case EStep.step_1: {
          // wait for 500ms
          yield this.pauseAndResumeAfterMs("wait_for_500ms", 500);
          console.log("after 500ms since start");

          yield this.pauseAndResumeAfterMs("wait_for_1000ms", 1000);
          console.log("after 1500ms since start. move next");

          // Move to step 2
          this.step = EStep.step_2;
          yield { canContinue: true, needSave: true, activeStep: this.step };
          break;
        }
        case EStep.step_2: {
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
          this.step = EStep.step_end;
          yield { canContinue: true, needSave: true, activeStep: this.step };
          break;
        }
        default: {
          hasNext = false;
          break;
        }
      }
    }

    return { isEnd: true, finalState: this.state };
  }

  private async withDurableAction(
    key: string,
    action: () => any,
    opt?: ExeOpt
  ) {
    const shouldUseCache = opt ? !opt.ignoreCache : true;
    const cacheKey = `${this.step}:${key}`;
    if (shouldUseCache) {
      const tmp = this.cache[cacheKey];
      if (tmp) {
        return tmp;
      }
    }

    const newVal = action();
    this.cache[cacheKey] = newVal;
    return newVal;
  }

  private pauseAndResumeAfterMs(
    key: string,
    timeoutMs: number,
    opt?: ExeOpt
  ): DurableStateIterator {
    const shouldUseCache = opt ? !opt.ignoreCache : true;
    const cacheKey = `${this.step}:scheduler:${key}`;

    if (shouldUseCache) {
      const tmp = this.cache[cacheKey];
      if (Date.now() >= tmp) {
        return { canContinue: true, needSave: false, activeStep: this.step };
      }
    }

    const resumeAt = Date.now() + timeoutMs;
    this.cache[cacheKey] = resumeAt;
    return {
      canContinue: false,
      needSave: false,
      activeStep: this.step,
      resumeTrigger: {
        type: "time",
        resumeAt,
      },
    };
  }

  toJSON() {
    return { step: this.step, state: this.state, cache: this.cache };
  }

  fromJSON(data: any) {
    this.step = data.step;
    this.state = data.state;
    this.cache = data.cache;
  }
}

async function main() {
  let ins = new DurableState();
  ins.step = EStep.step_begin;

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
        ins = new DurableState();
        ins.fromJSON(preData);
      }
      const res = await runtimeRun(ins, maxIter);

      // save to db somehow
      preData = res.saveData;
      finalValue = res.finalValue;

      // handle resume
      if (res.resumeTrigger)
        await runtimeHandleContinueTrigger(res.resumeTrigger);
    }
  }
  console.log("finalValue:", finalValue);
}
main();

async function runtimeRun(ins: DurableState, maxIter: number) {
  let work = ins.exec();
  let it = await work.next();
  let resumeTrigger;
  let saveData = null;
  let finalValue = null;
  while (!it.done) {
    it = await work.next();
    console.log("it:", --maxIter, "->", it);
    if (!it.done && it.value.canContinue === false) {
      // TODO: pause and register resume
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

async function runtimeHandleContinueTrigger(resumeTrigger: ContinueTrigger) {
  if (resumeTrigger.type === "time") {
    const needToSleep = resumeTrigger.resumeAt - Date.now();
    console.log(`Handle resumeTrigger -> sleep ${needToSleep} `);
    await setTimeout(needToSleep);
    return;
  }

  throw new Error(`unknown resume trigger ${resumeTrigger.type}`);
}
