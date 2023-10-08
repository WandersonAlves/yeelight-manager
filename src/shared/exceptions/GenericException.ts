import { IHttpError } from '../contracts';
import { INTERNAL_SERVER_ERROR } from 'http-status';

export default class GenericException extends Error {
  statusCode: number;
  extras: any;

  constructor(params: { name: string; message: string; extras?: any; statusCode?: number }) {
    super(params.message);
    this.statusCode = params.statusCode || INTERNAL_SERVER_ERROR;
    this.name = params.name;
    this.extras = params.extras;

    Object.setPrototypeOf(this, GenericException.prototype);
  }

  toString(): string {
    return `${this.name}: ${this.message}`;
  }

  /**
   * Dont use this method, this project has some legacy code that refers to old http server idea
   *
   * @deprecated
   * @returns
   */
  formatError(): IHttpError {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
      extras: this.extras,
    };
  }
}
