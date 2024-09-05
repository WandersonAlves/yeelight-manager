import { UseCase } from '../../../shared/contracts';
import { inject, injectable } from 'inversify';
import { logger } from '../../../shared/Logger';
import Discovery from '../../../infra/yeelight/discovery/Discovery';
import ExceptionHandler from '../../../shared/decorators/ExceptionHandler';
import YeelightDevice from '../../../infra/yeelight/devices/YeelightDevice';

interface DiscoverDevicesParams {
    waitTime?: number;
}

@injectable()
export default class DiscoverDevicesCase implements UseCase<DiscoverDevicesParams, YeelightDevice[]> {
    @inject(Discovery) private discovery: Discovery;

    @ExceptionHandler()
    async execute(params: DiscoverDevicesParams = {}) {
        const { waitTime } = params;
        logger.info('Discovery started...', { label: 'Discovery' });

        const devices = await this._discoverDevices(waitTime);
        logger.info('Discovery finished.', { label: 'Discovery' });
        return devices;
    }

    private async _discoverDevices(waitTime?: number) {
        const devices: YeelightDevice[] = await this._discoverDevicesSSDP(waitTime);
        if (devices.length) {
            return devices;
        }
        const devicesFallback: YeelightDevice[] = await this._discoverDevicesFallback();
        if (devicesFallback.length) {
            return devicesFallback;
        }
        return [];
    }

    private async _discoverDevicesFallback() {
        logger.info('Performing IP scan to find devices.', { label: 'Discovery' });
        const devicesFallback = await this.discovery.discoverDevicesFallback();
        logger.info(`Found ${devicesFallback.length} devices via IP scan.`, { label: 'Discovery' });
        return devicesFallback;
    }

    private async _discoverDevicesSSDP(waitTime?: number) {
        await this.discovery.discoverDevices(waitTime);
        const devices = this.discovery.getDevices();
        logger.info(`Found ${devices.length} devices via SSDP.`, { label: 'Discovery' });
        return devices;
    }
}
