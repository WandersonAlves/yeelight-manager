import { NOT_FOUND } from 'http-status';
import GenericException from './GenericException';

export default class DeviceNotFoundException extends GenericException {
  constructor(id: string) {
    const params = {
      name: 'DeviceNotFoundException',
      message: `Device with id ${id} not found`,
      statusCode: NOT_FOUND,
    };
    super(params);

    Object.setPrototypeOf(this, DeviceNotFoundException.prototype);
  }
}
