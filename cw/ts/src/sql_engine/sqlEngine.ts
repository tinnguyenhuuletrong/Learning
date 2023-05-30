export type FilterFunc<S> = (arg: Partial<S>) => boolean;
export type SelectFunc<S> = (
  arg: Partial<S> | Group<S>
) => Partial<S> | Group<S>;
export type GroupByFunc<S> = (arg: Partial<S>) => any;

export type Group<S> = [any, Array<Partial<S>>];
export type ExeRes<S> = Array<Partial<S>> | Array<Group<S>>;

type GetElementType<T extends any[]> = T extends (infer U)[] ? U : never;

class Context<S = any> {
  public fromSource?: S[];
  public whereFunc?: FilterFunc<S>;
  public selectFunc?: SelectFunc<S>;
  public groupByFunc?: GroupByFunc<S>[];
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

  where(func: FilterFunc<S>) {
    this._ctx.whereFunc = func;
    return this;
  }

  orderBy() {
    return this;
  }

  groupBy(...func: GroupByFunc<S>[]) {
    this._ctx.groupByFunc = func;
    return this;
  }

  having() {
    return this;
  }

  execute(): ExeRes<S> {
    if (!this._ctx.fromSource) return [];

    const DEFAULT_KEY = "__default__";

    let pharse1: Array<S> = this._ctx.fromSource;
    let pharse2: Array<Partial<S>>;
    let pharse3: Record<any, Array<Partial<S>>> = {};

    const { whereFunc, selectFunc, groupByFunc } = this._ctx;
    const hasGroupBy = groupByFunc?.length && groupByFunc?.length > 0;
    if (whereFunc) pharse2 = pharse1.filter(whereFunc);
    else pharse2 = pharse1;

    if (hasGroupBy) {
      for (const itm of pharse2) {
        const groupName = groupByFunc.map((fn) => fn(itm));
        this._set(pharse3, groupName, itm);
      }
    } else {
      pharse3 = {
        [DEFAULT_KEY]: pharse2,
      };
    }
    // console.log(pharse3);
    let finalRes: Array<Group<S>> = this._entities(pharse3);

    // don't have groupBy -> return default group plain object
    if (!hasGroupBy) {
      if (selectFunc) {
        return finalRes[0][1].map(selectFunc) as Array<Group<S>>;
      } else {
        return finalRes[0][1];
      }
    }

    if (selectFunc) {
      finalRes = finalRes.map(selectFunc) as Array<Group<S>>;
    }
    return finalRes;
  }

  private _set(obj: any, path: string[], value: any) {
    var schema = obj;
    var pList = path;
    var len = pList.length;
    for (var i = 0; i < len - 1; i++) {
      var elem = pList[i];
      if (!schema[elem]) schema[elem] = {};
      schema = schema[elem];
    }

    if (!Array.isArray(schema[pList[len - 1]])) schema[pList[len - 1]] = [];
    schema[pList[len - 1]].push(value);
  }

  private _entities(obj: any) {
    const res: any[] = [];
    if (Array.isArray(obj)) return obj;
    for (const [k, v] of Object.entries(obj)) {
      res.push([k, this._entities(v)]);
    }
    return res;
  }
}

export function query<S extends any[]>() {
  const ctx = new QueryEngine<GetElementType<S>>();
  return ctx;
}
