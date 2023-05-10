import { INTERNAL_SERVER_ERROR } from "http-status";
import GenericException from "./GenericException";

export default class TimeoutException extends GenericException {
  constructor(kind: 'connect' | 'ack', value: string) {
    const messages = {
      connect: `Timeout when trying to connect into ${value}`,
      ack: `Timeout to ACK the command sent to ${value}`
    };
    const params = {
      name: 'TimeoutException',
      message: messages[kind],
      statusCode: INTERNAL_SERVER_ERROR,
    };
    super(params);

    Object.setPrototypeOf(this, TimeoutException.prototype);
  }
}