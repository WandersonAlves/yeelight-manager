import { TRestParameters } from '../types';
import GenericException from '../exceptions/GenericException';
import HttpResponse from '../responses/HttpResponse';

type Left = GenericException;
type Right<T> = T;
export type Either<T> = [Left, Right<T>];

export interface IPaginationRequestParams {
  skip?: number;
  limit?: number;
}

export interface UseCaseParams<H = any, B = any> {
  headers?: H;
  body?: B;
}

export interface UseCase<Success = any, Fail = any> {
  execute(params?: UseCaseParams): Promise<HttpResponse<Success | Fail>>;
}

export interface DataRepository<T = any> {
  find(filter?: TRestParameters<T>): Promise<T[]>;
  findOne(filter?: TRestParameters<T>): Promise<T>;

  create(obj: T): Promise<T>;
  updateById(id: string | number, obj: Partial<T>): Promise<T>;
  removeById(id: string | number): Promise<null>;
}

export interface DatabaseConnection {
  connect(): Promise<this>;
  disconnect(): Promise<void>;
}

export interface IHttpRequest<B = any, Q = any, P = any, H = any> {
  body?: B;
  query?: Q;
  params?: P;
  headers?: H;
}

export interface IHttpError {
  name: string;
  message: string;
  statusCode: number;
  extras?: any;
}

export interface RequestRouter {
  route(req: IHttpRequest): Promise<HttpResponse<any>>;
}
