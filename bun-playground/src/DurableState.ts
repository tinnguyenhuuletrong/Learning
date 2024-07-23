export class DurableState<
  EStep,
  StateShape = Record<string, any>,
  ExtAuditLogType = "others"
> {
  private step!: EStep;
  private cache: Record<string, any> = {};
  private system: Record<string, DurableStateSystemEntry> = {};
  private logs: AuditLogEntry<ExtAuditLogType, EStep>[] = [];
  protected state: StateShape = {} as StateShape;
  protected stepHandler = new Map<EStep, StepHandler<EStep>>();

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

  async *exec(): AsyncGenerator<
    DurableStateIterator<EStep>,
    DurableStateReturn<StateShape> | null
  > {
    let hasNext = true;
    const step = this.step;
    const handler = this.stepHandler.get(step);
    if (!handler) throw new Error(`missing stepHandler for ${step}`);
    let res = handler();

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
        res = handler();
      } else {
        yield it.value as DurableStateIterator<EStep>;
      }
    }

    return { isEnd: true, finalState: this.state };
  }

  protected async withAction<TRes = any>(
    key: string,
    action: () => Promise<any>,
    opt?: ExeOpt
  ): Promise<{
    it?: DurableStateIterator<EStep>;
    value: TRes | undefined;
  }> {
    const shouldUseCache = opt ? !opt.ignoreCache : true;
    const maxRetry = opt?.maxRetry ? opt.maxRetry : 0;
    const cacheKey = `${this.step}:${key}`;
    if (shouldUseCache) {
      const tmp = this.cache[cacheKey];
      if (tmp) {
        return {
          it: undefined,
          value: tmp,
        };
      }
    }

    let newVal;
    try {
      newVal = await action();
    } catch (error: any) {
      const res = this.canRetry(key, maxRetry);
      if (res.counter > 0) {
        this.addLog({
          type: "action_error",
          values: {
            key,
            errorMessage: error?.message,
            counter: res.counter,
            maxRetry,
          },
        });
        return {
          it: this.waitForMs(res.retryKey, 1000).it,
          value: undefined,
        };
      }

      throw error;
    }

    this.cache[cacheKey] = newVal;
    this.addLog({
      type: "cache",
      values: {
        key: cacheKey,
      },
    });
    return {
      it: { canContinue: true, activeStep: this.step },
      value: newVal,
    };
  }

  protected waitForMs(
    key: string,
    timeoutMs: number
  ): {
    it?: DurableStateIterator<EStep>;
    value: number;
  } {
    const cacheKey = `${this.step}:timer:${key}`;

    const tmp = this.system[cacheKey];
    if (tmp) {
      if (tmp?.type !== "timer") throw new Error("invalid system record");
      if (tmp.isDone) {
        return {
          it: undefined,
          value: tmp.resumeAfter,
        };
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
      it: {
        canContinue: false,
        activeStep: this.step,
        resumeTrigger: {
          resumeId,
          type: "time",
          resumeAt,
        },
      },
      value: resumeAt,
    };
  }

  protected waitForEvent<TRes = any>(
    key: string,
    requestPayload: any
  ): {
    it?: DurableStateIterator<EStep>;
    value: TRes | undefined;
  } {
    const cacheKey = `${this.step}:event:${key}`;
    const resumeId = this.genResumeId(key);

    const tmp = this.system[cacheKey];
    if (tmp) {
      if (tmp.type !== "event") throw new Error("invalid system record");
      if (tmp.isDone) {
        return {
          it: undefined,
          value: tmp.responsePayload,
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
        activeStep: this.step,
        resumeTrigger: {
          type: "event",
          resumeId,
        },
      },
      value: undefined,
    };
  }

  protected genResumeId(key: string) {
    return `${key}-${Date.now().toString(32)}`;
  }

  protected addLog(itm: AuditLogEntry<ExtAuditLogType, EStep>) {
    if (this.opt?.withAuditLog) {
      itm._at = Date.now();
      itm._step = this.step;
      this.logs.push(itm);
    }
  }

  private canRetry(
    key: string,
    maxRetry: number
  ): {
    counter: number;
    retryKey: string;
  } {
    const cacheKey = `${this.step}:__retry__:${key}`;
    const val = this.cache[cacheKey] ?? maxRetry;
    this.cache[cacheKey] = val - 1;
    return {
      counter: this.cache[cacheKey],
      retryKey: cacheKey,
    };
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
  >(type: Constructor<T>, data: any, opt?: DurableStateOpt): T {
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
  activeStep: T;
  resumeTrigger?: ContinueTrigger;
};
export type DurableStateReturn<StateShape> = {
  isEnd: boolean;
  finalState: StateShape;
};
export type ExeOpt = {
  ignoreCache?: boolean;
  maxRetry?: number;
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
export type StepHandler<EStep> = () => StepIt<EStep>;

type AuditLogEntry<S, EStep> = {
  type:
    | "init"
    | "cache"
    | "transition"
    | "interrupt_begin"
    | "interrupt_end"
    | "action_error"
    | S;
  values: Record<string, any>;
  _at?: number;
  _step?: EStep;
};
export type DurableStateOpt = {
  withAuditLog: boolean;
};

type Constructor<T> = new (...args: any[]) => T;
