export class DurableState<
  EStep,
  StateShape = Record<string, any>,
  ExtAuditLogType = "others"
> {
  private step!: EStep;
  protected state: StateShape = {} as StateShape;
  private cache: Record<string, any> = {};
  private system: Record<string, DurableStateSystemEntry> = {};
  protected stepHandler = new Map<EStep, StepHandler<EStep>>();
  private logs: AuditLogEntry<ExtAuditLogType>[] = [];

  constructor(defaultStep?: EStep, private opt?: DurableStateOpt) {
    if (defaultStep) {
      this.step = defaultStep;
      this.addLog({
        type: "init",
        values: {
          defaultStep,
        },
      });
    }
  }

  get currentStep() {
    return this.step;
  }

  get auditLogs() {
    return this.logs;
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

  resolveResume(resumeId: string, payload?: any) {
    const tmp = Object.values(this.system).find(
      (itm) => itm.resumeId === resumeId
    );

    if (!tmp) throw new Error("resumeId not exists. Something wrong ?");
    tmp.responsePayload = payload;
    tmp.isDone = true;
    this.addLog({
      type: "interrupt_end",
      values: {
        resumeId,
      },
    });
  }

  async *exec(
    opt?: ExeOpt
  ): AsyncGenerator<
    DurableStateIterator<EStep>,
    DurableStateReturn<StateShape> | null
  > {
    let hasNext = true;
    const step = this.step;
    const handler = this.stepHandler.get(step);
    if (!handler) throw new Error(`missing stepHandler for ${step}`);
    let res = handler(opt);

    while (hasNext) {
      const it = await res.next();
      if (it.done) {
        if (it.value.nextStep === null) break;

        // move to next step
        // TODO: add log
        this.addLog({
          type: "transition",
          values: {
            from: this.step,
            to: it.value.nextStep,
          },
        });
        const step = it.value.nextStep;
        this.step = step;
        const handler = this.stepHandler.get(step);
        if (!handler) throw new Error(`missing stepHandler for ${step}`);
        res = handler(opt);
      } else {
        yield it.value as DurableStateIterator<EStep>;
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
    this.addLog({
      type: "cache",
      values: {
        key: cacheKey,
      },
    });
    return newVal;
  }

  protected pauseAndResumeAfterMs(
    key: string,
    timeoutMs: number,
    opt?: ExeOpt
  ): DurableStateIterator<EStep> {
    const cacheKey = `${this.step}:scheduler:${key}`;

    const tmp = this.system[cacheKey];
    if (tmp) {
      if (tmp?.type !== "timer") throw new Error("invalid system record");
      if (tmp.isDone) {
        return { canContinue: true, needSave: false, activeStep: this.step };
      }
    }

    const resumeAt = Date.now() + timeoutMs;
    const resumeId = this.genResumeId(key);
    this.system[cacheKey] = {
      type: "timer",
      isDone: false,
      resumeId,
      resumeAfter: resumeAt,
    };
    this.addLog({
      type: "interrupt_begin",
      values: {
        type: "time",
        resumeId,
      },
    });
    return {
      canContinue: false,
      needSave: false,
      activeStep: this.step,
      resumeTrigger: {
        resumeId,
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
      if (tmp.type !== "event") throw new Error("invalid system record");
      if (tmp.isDone) {
        return {
          it: { canContinue: true, needSave: false, activeStep: this.step },
          responsePayload: tmp.responsePayload,
        };
      }
    }

    this.system[cacheKey] = {
      type: "event",
      isDone: false,
      resumeId,
      requestPayload,
      responsePayload: null,
    };
    this.addLog({
      type: "interrupt_begin",
      values: {
        type: "event",
        resumeId,
      },
    });
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

  protected addLog(itm: AuditLogEntry<ExtAuditLogType>) {
    if (this.opt?.withAuditLog) {
      itm.at = Date.now();
      this.logs.push(itm);
    }
  }

  toJSON() {
    const { step, state, cache, system, logs } = this;
    return { step, state, cache, system, logs };
  }

  static fromJSON<
    EStep,
    ShapeState,
    ExtAuditLogType,
    T extends DurableState<EStep, ShapeState, ExtAuditLogType>
  >(type: { new (...args: any): T }, data: any, opt?: DurableStateOpt): T {
    const ins = new type(undefined, opt);
    ins.step = data.step;
    ins.state = data.state;
    ins.cache = data.cache;
    ins.system = data.system;
    ins.logs = data.logs;
    return ins;
  }
}

export type ContinueTrigger =
  | {
      type: "time";
      resumeId: string;
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
export type DurableStateReturn<StateShape> = {
  isEnd: boolean;
  finalState: StateShape;
};
export type ExeOpt = {
  ignoreCache: boolean;
};
export type TimerSystemEntry = {
  type: "timer";
  resumeId: string;
  isDone: boolean;
  resumeAfter: number;
  responsePayload?: any;
};
export type EventSystemEntry = {
  type: "event";
  resumeId: string;
  isDone: boolean;
  requestPayload?: any;
  responsePayload?: any;
};
type DurableStateSystemEntry = TimerSystemEntry | EventSystemEntry;

export type StepIt<EStep> = AsyncIterator<
  DurableStateIterator<EStep>,
  { nextStep: EStep | null }
>;
export type StepHandler<EStep> = (opt?: ExeOpt) => StepIt<EStep>;

type AuditLogEntry<S> = {
  type:
    | "init"
    | "cache"
    | "transition"
    | "interrupt_begin"
    | "interrupt_end"
    | S;
  values: Record<string, any>;
  at?: number;
};
export type DurableStateOpt = {
  withAuditLog: boolean;
};
