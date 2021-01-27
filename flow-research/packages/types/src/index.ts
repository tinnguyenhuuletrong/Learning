export interface IExeResult {
  isSuccess: boolean;

  nextNode?: string;
  extra?: { [key: string]: any };
}
