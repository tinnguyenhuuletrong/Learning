export type FilterFunc<S> = (arg: Partial<S>) => boolean;
export type SelectFunc<S> = (arg: Partial<S>) => Partial<S>;

class Context<S = any> {
  public fromSource?: S[];
  public whereFunc?: FilterFunc<S>;
  public selectFunc?: SelectFunc<S>;
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

  groupBy() {
    return this;
  }

  having() {
    return this;
  }

  execute(): Array<Partial<S>> {
    if (!this._ctx.fromSource) return [];

    let res: Array<Partial<S>> = this._ctx.fromSource;

    const { whereFunc, selectFunc } = this._ctx;
    if (whereFunc) res = res.filter(whereFunc);
    if (selectFunc) res = res.map((itm) => selectFunc(itm));

    return res;
  }
}

type GetElementType<T extends any[]> = T extends (infer U)[] ? U : never;
export function query<S extends any[]>() {
  const ctx = new QueryEngine<GetElementType<S>>();
  return ctx;
}
