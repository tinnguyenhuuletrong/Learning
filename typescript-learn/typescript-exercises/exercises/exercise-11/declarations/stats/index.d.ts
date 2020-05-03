declare module "stats" {
  type ComparatorFunc<T> = (a: T, b: T) => number;
  type GetValueFunc<T> = (a: T) => number;
  type StatIndexFunc = <T>(input: T[], comparator: ComparatorFunc<T>) => number;
  type StatElementFunc = <T>(
    input: T[],
    comparator: ComparatorFunc<T>
  ) => T | null;

  export const getMaxIndex: StatIndexFunc;
  export const getMinIndex: StatIndexFunc;
  export const getMedianIndex: StatIndexFunc;
  export const getMaxElement: StatElementFunc;
  export const getMinElement: StatElementFunc;
  export const getMedianElement: StatElementFunc;

  export function getAverageValue<T>(
    input: T[],
    comparator: GetValueFunc<T>
  ): number;
}
