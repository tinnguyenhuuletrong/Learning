export type FilterFunc<S> = (arg: Partial<S>) => boolean;
export type SelectFunc<S> = (
  arg: Partial<S> | Group<S>
) => Partial<S> | Group<S> | unknown;
export type GroupByFunc<S> = (arg: Partial<S>) => any;
export type OrderByFunc<S> = (
  arg1: Partial<S> | Group<S>,
  arg2: Partial<S> | Group<S>
) => number;
export type HavingFunc<S> = (arg: Group<S>) => boolean;

export type Group<S> = [any, Array<Partial<S>>];
export type ExeRes<S> = Array<Partial<S>> | Array<Group<S>>;

type GetElementType<T extends any[]> = T extends (infer U)[] ? U : never;

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

  select(func?: SelectFunc<S>) {
    this._ctx.selectFunc = func;
    return this;
  }

  from(data?: S[]) {
    if (data) this._ctx.fromSource = data;
    return this;
  }

  where(...func: FilterFunc<S>[]) {
    this._ctx.whereCondition?.push([...func]);
    return this;
  }

  orderBy(
    func: any // OrderByFunc<S>
  ) {
    this._ctx.orderByFunc = func;
    return this;
  }

  groupBy(...func: GroupByFunc<S>[]) {
    this._ctx.groupByFunc = func;
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
        finalRes = finalRes[0][1].map(selectFunc) as Array<Group<S>>;
      } else {
        finalRes = finalRes[0][1];
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
}

export function query<S extends any[]>() {
  const ctx = new QueryEngine<GetElementType<S>>();
  return ctx;
}
