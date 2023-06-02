export type FilterFunc<S> = (arg: S | Partial<S>) => boolean;
export type SelectFunc<S> = (
  arg: Partial<S> | Group<S>
) => Partial<S> | Group<S> | unknown;
export type GroupByFunc<S> = (arg: S | Partial<S>) => any;
export type OrderByFunc<S> = (
  arg1: Partial<S> | Group<S>,
  arg2: Partial<S> | Group<S>
) => number;
export type HavingFunc<S> = (arg: Group<S>) => boolean;

export type Group<S> = [any, Array<Partial<S>>];
export type ExeRes<S> = Array<Partial<S>> | Array<Group<S>>;

export type GetElementType<T extends any[]> = T extends (infer U)[] ? U : never;
export type JoinType<T extends any[]> = Array<T>;

type Conditional<S> = Array<S[]>;

class Context<S = any> {
  public fromSource?: S[];
  public whereCondition?: Conditional<FilterFunc<S>> = [];
  public selectFunc?: SelectFunc<S>;
  public groupByFunc?: GroupByFunc<S>[];
  public orderByFunc?: OrderByFunc<S>;
  public havingCondition?: Conditional<HavingFunc<S>> = [];
}

class QueryEngine<S = any> {
  private _ctx: Context<S> = new Context<S>();
  private _hasSelect = false;
  private _hasForm = false;
  private _hasOrderBy = false;
  private _hasGroupBy = false;

  _resetFlags() {
    this._hasSelect = false;
    this._hasForm = false;
    this._hasOrderBy = false;
    this._hasGroupBy = false;
  }

  select(func?: SelectFunc<S>) {
    if (this._hasSelect) {
      throw new Error("Duplicate SELECT");
    }

    this._ctx.selectFunc = func;
    this._hasSelect = true;
    return this;
  }

  from(...data: any[]) {
    if (this._hasForm) {
      throw new Error("Duplicate FROM");
    }
    if (data) {
      if (data.length === 1) {
        this._ctx.fromSource = data[0];
      } else {
        // generate joined source
        let it = Array(data.length).fill(0);
        let stop = false;
        let final: any = [];
        do {
          final.push(it.map((itm, idx) => data[idx][itm]));
          const [hasNext, nextVal] = this._next(data, it);
          if (nextVal) it = nextVal;
          stop = !hasNext;
        } while (!stop);

        this._ctx.fromSource = final as S[];
      }
    }
    this._hasForm = true;
    return this;
  }

  where(...func: FilterFunc<S>[]) {
    this._ctx.whereCondition?.push([...func]);
    return this;
  }

  orderBy(
    func: any // OrderByFunc<S>
  ) {
    if (this._hasOrderBy) {
      throw new Error("Duplicate ORDERBY");
    }
    this._ctx.orderByFunc = func;
    this._hasOrderBy = true;
    return this;
  }

  groupBy(...func: GroupByFunc<S>[]) {
    if (this._hasGroupBy) {
      throw new Error("Duplicate GROUPBY");
    }
    this._ctx.groupByFunc = func;
    this._hasGroupBy = true;
    return this;
  }

  having(...func: HavingFunc<S>[]) {
    this._ctx.havingCondition?.push([...func]);
    return this;
  }

  execute(): ExeRes<S> {
    if (!this._ctx.fromSource) return [];

    const DEFAULT_KEY = "__default__";

    let pharse1: Array<S> = this._ctx.fromSource;
    let pharse2: Array<Partial<S>>;
    let pharse3: Map<any, any> = new Map();

    const {
      whereCondition = [],
      selectFunc,
      groupByFunc,
      orderByFunc,
      havingCondition = [],
    } = this._ctx;
    const hasGroupBy = groupByFunc?.length && groupByFunc?.length > 0;
    pharse2 = this._applyCondition(pharse1, whereCondition);

    if (hasGroupBy) {
      for (const itm of pharse2) {
        const groupName = groupByFunc.map((fn) => fn(itm));
        this._set(pharse3, groupName, itm);
      }
    } else {
      pharse3.set(DEFAULT_KEY, pharse2);
    }
    let finalRes: Array<Group<S>> | Array<Partial<S>> = this._entities(pharse3);

    // don't have groupBy -> return default group plain object
    if (!hasGroupBy) {
      if (selectFunc) {
        finalRes = (finalRes as any)[0][1].map(selectFunc) as Array<Group<S>>;
      } else {
        finalRes = (finalRes as any)[0][1];
      }

      if (orderByFunc) {
        finalRes = finalRes.sort(orderByFunc);
      }
      return finalRes;
    }

    finalRes = this._applyCondition(
      finalRes as Array<Group<S>>,
      havingCondition
    );

    if (selectFunc) {
      finalRes = finalRes.map(selectFunc) as Array<Group<S>>;
    }
    if (orderByFunc) {
      finalRes = finalRes.sort(orderByFunc);
    }
    return finalRes;
  }

  private _set(obj: Map<any, any>, path: string[], value: any) {
    var schema = obj;
    var pList = path;
    var len = pList.length;
    for (var i = 0; i < len - 1; i++) {
      var elem = pList[i];
      if (!schema.get(elem)) schema.set(elem, new Map());
      schema = schema.get(elem);
    }

    const lastKey = pList[len - 1];
    if (!Array.isArray(schema.get(lastKey))) schema.set(lastKey, []);
    schema.get(lastKey).push(value);
  }

  private _entities(obj: Map<any, any>) {
    const res: any[] = [];
    if (Array.isArray(obj)) return obj;
    for (const [k, v] of obj.entries()) {
      res.push([k, this._entities(v)]);
    }
    return res;
  }

  private _isEmpty(a: any) {
    if (a === null || a === undefined) return false;
    if (!Array.isArray(a)) return false;
    return a.length === 0;
  }

  private _applyCondition<I, C extends Function>(
    input: I[],
    condition: Conditional<C>
  ): I[] {
    const out: I[] = [];
    for (const itm of input) {
      let res = true;
      for (const orFuncs of condition) {
        res = res && orFuncs.some((f) => f(itm));
      }
      if (res) out.push(itm);
    }
    return out;
  }

  private _next(A: any[], idx: number[]): [true, number[]] | [false, null] {
    if (A.length !== idx.length) throw new Error("missmatch length");
    const nextVal = [...idx];

    let l = nextVal.length - 1;
    while (l > 0 && nextVal[l] >= A[l].length - 1) {
      nextVal[l] = 0;
      l--;
    }

    // end
    if (l < 0) {
      return [false, null];
    }
    const canInc = nextVal[l] < A[l].length - 1;
    if (!canInc) return [false, null];

    nextVal[l] = nextVal[l] + 1;
    return [true, nextVal];
  }
}

export function query<S extends any[]>() {
  const ctx = new QueryEngine<GetElementType<S>>();
  return ctx;
}
