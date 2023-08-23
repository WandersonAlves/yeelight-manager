import { INTERNAL_SERVER_ERROR } from 'http-status';
import { JsonStringify } from '../Logger';
import GenericException from './GenericException';

export default class CommandFailureException extends GenericException {
  constructor(who: string, data: any, cmd: any) {
    const params = {
      name: 'CommandFailureException',
      message: `${who} refused to run the command.\nData received: ${JsonStringify(data)}Command handled: ${JsonStringify(cmd)}`,
      statusCode: INTERNAL_SERVER_ERROR,
    };
    super(params);

    Object.setPrototypeOf(this, CommandFailureException.prototype);
  }
}
