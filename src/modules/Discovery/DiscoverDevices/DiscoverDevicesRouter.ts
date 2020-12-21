import { RequestRouter } from '../../../shared/contracts';
import { inject, injectable } from 'inversify';
import DiscoverDevicesCase from './DiscoverDevicesCase';

@injectable()
export default class DiscoverDevicesRouter implements RequestRouter {
  @inject(DiscoverDevicesCase) private case: DiscoverDevicesCase;
  async route() {
    const result = await this.case.execute();
    return result;
  }
}
