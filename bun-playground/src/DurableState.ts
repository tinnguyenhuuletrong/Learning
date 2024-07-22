export class DurableState<EStep> {
  protected step!: EStep;
  protected state: Record<string, any> = {};
  private cache: Record<string, any> = {};
  private system: Record<string, DurableStateSystemEntry> = {};
  protected stepHandler = new Map<EStep, StepHandler<EStep>>();

  constructor(defaultStep?: EStep) {
    if (defaultStep) {
      this.step = defaultStep;
    }
  }

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
  ): AsyncIterator<DurableStateIterator<EStep>, DurableStateReturn> {
    let hasNext = true;
    const step = this.step;
    const handler = this.stepHandler.get(step);
    if (!handler) throw new Error(`missing stepHandler for ${step}`);
    let res = handler(this, opt);

    while (hasNext) {
      const it = await res.next();
      if (it.done) {
        if (it.value.nextStep === null) break;
        const step = it.value.nextStep;
        const handler = this.stepHandler.get(step);
        if (!handler) throw new Error(`missing stepHandler for ${step}`);
        res = handler(this, opt);
      } else {
        yield it.value;
      }
    }

    return { isEnd: true, finalState: this.state };
  }

  protected async withDurableAction(
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

  protected pauseAndResumeAfterMs(
    key: string,
    timeoutMs: number,
    opt?: ExeOpt
  ): DurableStateIterator<EStep> {
    const shouldUseCache = opt ? !opt.ignoreCache : true;
    const cacheKey = `${this.step}:scheduler:${key}`;

    const tmp = this.system[cacheKey];
    if (shouldUseCache && tmp) {
      if (tmp?.type !== "timer") throw new Error("invalid system record");
      if (Date.now() >= tmp.resumeAfter) {
        return { canContinue: true, needSave: false, activeStep: this.step };
      }
    }

    const resumeAt = Date.now() + timeoutMs;
    this.system[cacheKey] = {
      type: "timer",
      resumeId: this.genResumeId(key),
      resumeAfter: resumeAt,
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

  protected pasueAndResumeOnEvent(
    key: string,
    requestPayload: any
  ): {
    it: DurableStateIterator<EStep>;
    responsePayload: any;
  } {
    const cacheKey = `${this.step}:event:${key}`;
    const resumeId = this.genResumeId(key);

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

  protected genResumeId(key: string) {
    return `${key}-${Date.now().toString(32)}`;
  }

  toJSON() {
    const { step, state, cache, system } = this;
    return { step, state, cache, system };
  }

  static fromJSON<EStep, T extends DurableState<EStep>>(
    type: { new (...args: any): T },
    data: any
  ) {
    const ins = new type();
    ins.step = data.step;
    ins.state = data.state;
    ins.cache = data.cache;
    ins.system = data.system;
    return ins;
  }
}

export type ContinueTrigger =
  | {
      type: "time";
      resumeAt: number;
    }
  | {
      type: "event";
      resumeId: string;
    };
export type DurableStateIterator<T> = {
  canContinue: boolean;
  needSave: boolean;
  activeStep: T;
  resumeTrigger?: ContinueTrigger;
};
export type DurableStateReturn = {
  isEnd: boolean;
  finalState: Record<string, any>;
};
export type ExeOpt = {
  ignoreCache: boolean;
};
type DurableStateSystemEntry =
  | {
      type: "timer";
      resumeId: string;
      resumeAfter: number;
    }
  | {
      type: "event";
      resumeId: string;
      requestPayload?: any;
      responsePayload?: any;
    };

export type StepIt<EStep> = AsyncIterator<
  DurableStateIterator<EStep>,
  { nextStep: EStep | null }
>;
export type StepHandler<EStep> = (
  ins: DurableState<EStep>,
  opt?: ExeOpt
) => StepIt<EStep>;
