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
    let pharse3: Record<any, Array<Partial<S>>>;

    const { whereFunc, selectFunc, groupByFunc } = this._ctx;
    const hasGroupBy = groupByFunc?.length && groupByFunc?.length > 0;
    if (whereFunc) pharse2 = pharse1.filter(whereFunc);
    else pharse2 = pharse1;

    if (hasGroupBy) {
      pharse3 = pharse2.reduce((acc, itm) => {
        const groupName = groupByFunc.map((fn) => fn(itm)).join(".");
        const tmp = acc[groupName] || [];
        acc[groupName] = [...tmp, itm];
        return acc;
      }, {});
    } else {
      pharse3 = {
        [DEFAULT_KEY]: pharse2,
      };
    }
    // console.log(pharse3);
    let finalRes: Array<Group<S>> = Object.keys(pharse3).map((k) => [
      k,
      pharse3[k],
    ]);

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
}

export function query<S extends any[]>() {
  const ctx = new QueryEngine<GetElementType<S>>();
  return ctx;
}
