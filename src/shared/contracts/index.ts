import GenericException from '../exceptions/GenericException';

type Left = GenericException | null;
type Right<T> = T | null;
export type Either<T> = [Left, Right<T>];

export type ResolveFn = (value: void | PromiseLike<void>) => void;
export type RejectFn = (e: Error) => void;


export interface UseCase<Params, Result> {
  execute(params?: Params): Promise<Result>;
}


export interface IHttpError {
  name: string;
  message: string;
  statusCode: number;
  extras?: any;
}
