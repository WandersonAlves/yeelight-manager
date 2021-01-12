import { IHttpRequest, RequestRouter } from '../../../shared/contracts';
import { inject, injectable } from 'inversify';
import RetrieveDeviceCase from './RetrieveDeviceCase';

@injectable()
export default class RetrieveDeviceRouter implements RequestRouter {
  @inject(RetrieveDeviceCase) private case: RetrieveDeviceCase;
  async route({ headers }: IHttpRequest<void, void, void, { deviceid: string }>) {
    const result = await this.case.execute({ headers });
    return result;
  }
}
