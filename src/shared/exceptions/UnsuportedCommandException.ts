import { FAILED_DEPENDENCY } from 'http-status';
import GenericException from './GenericException';

export default class UnsuportedCommandException extends GenericException {
  constructor(id: string, kind: string, value?: string) {
    const params = {
      name: 'UnsuportedCommandException',
      message: `Device with id ${id} can't execute the command '${kind}' with value '${value}'`,
      statusCode: FAILED_DEPENDENCY,
    };
    super(params);

    Object.setPrototypeOf(this, UnsuportedCommandException.prototype);
  }
}
