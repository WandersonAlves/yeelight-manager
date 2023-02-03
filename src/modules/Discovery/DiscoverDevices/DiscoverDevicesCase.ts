import { UseCase } from '../../../shared/contracts';
import { inject, injectable } from 'inversify';
import { logger } from '../../../shared/Logger';
import Discovery from '../../../infra/yeelight/discovery';
import ExceptionHandler from '../../../shared/decorators/ExceptionHandler';
import Table from 'cli-table';
import YeelightDevice, { YeelightDeviceJSON } from '../../../infra/yeelight/devices/YeelightDevice';

interface DiscoverDevicesParams { waitTime?: number; logDevices?: boolean };

@injectable()
export default class DiscoverDevicesCase implements UseCase<DiscoverDevicesParams, YeelightDeviceJSON[]> {
  @inject(Discovery) private discovery: Discovery;

  @ExceptionHandler()
  async execute(params?: DiscoverDevicesParams) {
    const { waitTime, logDevices } = params;
    logger.info('Discovery started...', { label: 'Discovery' });

    const devices = await this._discoverDevices(waitTime);
    logger.info('Discovery finished.', { label: 'Discovery' });

    if (devices.length && logDevices) {
      this._logDevicesTable(devices);
    }
    return devices.map(d => d.toObject());
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

  private _logDevicesTable(devices: YeelightDevice[]) {
    const table = new Table({
      head: ['DeviceID', 'Name', 'IP', 'On?', 'Mode', 'Value', 'Brightness'],
      style: { head: ['green'] },
    });
    devices
      .sort((a, b) => (a.name < b.name ? -1 : 1))
      .forEach(d => {
        const {
          id,
          name = 'UnamedYeelight',
          host,
          port,
          power,
          colorMode,
          bright,
          rgbValue,
          colorTemperatureValue,
        } = d.toObject();
        const value = colorMode === 'RGB' ? rgbValue : colorTemperatureValue;
        table.push([id, name, `${host}:${port}`, power ? 'Yes' : 'No', colorMode, value, bright]);
      });
    logger.info('List of devices:\n' + table.toString(), {
      label: 'Discovery',
    });
  }
}
