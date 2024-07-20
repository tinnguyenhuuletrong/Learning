import { setTimeout } from "timers/promises";
enum EStep {
  step_begin = "step_begin",
  step_1 = "step_1",
  step_2 = "step_2",
  step_3 = "step_3",
  step_end = "step_end",
}
type ContinueTrigger =
  | {
      type: "time";
      resumeAt: number;
    }
  | {
      type: "event";
      resumeId: string;
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
type DurableStateSystemEntry =
  | {
      type: "timer";
      resumeId: string;
      at: number;
    }
  | {
      type: "event";
      resumeId: string;
      requestPayload?: any;
      responsePayload?: any;
    };

class DurableState {
  step!: EStep;
  private state: Record<string, any> = {};
  private cache: Record<string, any> = {};
  private system: Record<string, DurableStateSystemEntry> = {};

  getResume(resumeId: string) {
    const tmp = Object.values(this.system).find(
      (itm) => itm.resumeId === resumeId
    );
    if (!tmp) return null;
    return {
      ...tmp,
    } as DurableStateSystemEntry;
  }

  resolveResume(resumeId: string, payload: any) {
    const tmp = Object.values(this.system).find(
      (itm) => itm.resumeId === resumeId
    );

    if (!tmp) throw new Error("resumeId not exists. Something wrong ?");
    if (tmp.type !== "event")
      throw new Error("resumeId entry missmatched. exptected type event");
    tmp.responsePayload = payload;
  }

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
          this.step = EStep.step_3;
          yield { canContinue: true, needSave: true, activeStep: this.step };
          break;
        }
        case EStep.step_3: {
          // Waiting for event

          const { it, responsePayload } = this.pasueAndResumeOnEvent(
            "ask_for_confirm",
            `count=${this.state["count"]} is it ok  y / n ?`
          );
          yield it;
          console.log("after event. got data", responsePayload);
          this.state["isApproved"] = responsePayload === "y";

          this.step = EStep.step_end;
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

    const tmp = this.system[cacheKey];
    if (shouldUseCache && tmp) {
      if (tmp?.type !== "timer") throw new Error("invalid system record");
      if (Date.now() >= tmp.at) {
        return { canContinue: true, needSave: false, activeStep: this.step };
      }
    }

    const resumeAt = Date.now() + timeoutMs;
    this.system[cacheKey] = {
      type: "timer",
      resumeId: this._genResumeId(key),
      at: resumeAt,
    };
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

  private pasueAndResumeOnEvent(
    key: string,
    requestPayload: any
  ): {
    it: DurableStateIterator;
    responsePayload: any;
  } {
    const cacheKey = `${this.step}:event:${key}`;
    const resumeId = this._genResumeId(key);

    const tmp = this.system[cacheKey];
    if (tmp) {
      if (tmp?.type !== "event") throw new Error("invalid system record");
      if (tmp?.responsePayload) {
        return {
          it: { canContinue: true, needSave: false, activeStep: this.step },
          responsePayload: tmp.responsePayload,
        };
      }
    }

    this.system[cacheKey] = {
      type: "event",
      resumeId,
      requestPayload,
      responsePayload: null,
    };

    return {
      it: {
        canContinue: false,
        needSave: false,
        activeStep: this.step,
        resumeTrigger: {
          type: "event",
          resumeId,
        },
      },
      responsePayload: null,
    };
  }

  _genResumeId(key: string) {
    return `${key}-${Date.now().toString(32)}`;
  }

  toJSON() {
    const { step, state, cache, system } = this;
    return { step, state, cache, system };
  }

  fromJSON(data: any) {
    this.step = data.step;
    this.state = data.state;
    this.cache = data.cache;
    this.system = data.system;
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
        await runtimeHandleContinueTrigger(ins, res.resumeTrigger);
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

async function runtimeHandleContinueTrigger(
  ins: DurableState,
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
