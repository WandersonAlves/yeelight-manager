import GenericException from '../exceptions/GenericException';

type Left = GenericException;
type Right<T> = T;
export type Either<T> = [Left, Right<T>];


export interface UseCase<Params, Result> {
  execute(params?: Params): Promise<Result>;
}


export interface IHttpError {
  name: string;
  message: string;
  statusCode: number;
  extras?: any;
}
