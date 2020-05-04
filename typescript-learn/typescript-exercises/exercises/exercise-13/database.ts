type QEq<FieldType> = { $eq: FieldType };
type QGt<FieldType> = { $gt: FieldType };
type QLt<FieldType> = { $lt: FieldType };
type QIn<FieldType> = { $in: FieldType[] };
type Op<FieldType> =
  | FieldType
  | QEq<FieldType>
  | QGt<FieldType>
  | QLt<FieldType>
  | QIn<FieldType>;

type OpV<T> = { [P in keyof T]?: Op<T[P]> };
export type QueryObject<T> = {
  [P in keyof T]?: Op<T[P]>;
} & {
  $and?: OpV<T>[];
  $or?: OpV<T>[];
  $text?: string;
};

// TTin: Too lazy to imp logic :)

export class Database<T> {
  protected filename: string;
  protected fullTextSearchFieldNames: string[];

  constructor(filename: string, fullTextSearchFieldNames: string[]) {
    this.filename = filename;
    this.fullTextSearchFieldNames = fullTextSearchFieldNames;
  }

  async find(query: QueryObject<T>): Promise<T[]> {
    return [];
  }
}
