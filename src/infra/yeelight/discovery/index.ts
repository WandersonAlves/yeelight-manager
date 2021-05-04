import { createSocket } from 'dgram';
import { injectable } from 'inversify';
import { jsonString, logger } from '../../../shared/Logger';
import YeelightDevice from '../devices/YeelightDevice';

@injectable()
export default class Discovery {
  private devices: YeelightDevice[] = [];

  findDevice(idOrName: string): YeelightDevice {
    return this.devices.find(d => d.id === idOrName || d.name === idOrName);
  }

  getDevices(): YeelightDevice[] {
    return this.devices;
  }

  discoverDevices(timeToDiscover?: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const discoverMessage = `M-SEARCH * HTTP/1.1\r\nHOST: 239.255.255.250:1982\r\nMAN: "ssdp:discover"\r\nST: wifi_bulb\r\n`;
      const client = createSocket('udp4');

      const devices: YeelightDevice[] = [];

      client.send(discoverMessage, 1982, '239.255.255.250', error => {
        if (error) {
          logger.error(error.toString(), { label: 'Discovery' });
          client.close();
          reject(error);
        } else {
          logger.info('Discovery success', { label: 'Discovery' });
        }
      });
      client.on('message', msg => {
        const str = msg.toString();
        if (str.includes('HTTP/1.1 200 OK') && str.includes('yeelight')) {
          const device = YeelightDevice.CreateDevice(str);
          devices.push(device);
        }
      });

      setTimeout(() => {
        const uniqueDevices = [...new Map(devices.map(item => [item.id, item])).values()];
        this.devices = [...uniqueDevices];
        logger.info(`Found ${this.devices.length} devices`, { label: 'Discovery' });
        logger.debug(`Device list: ${jsonString(this.devices.map(d => d.toString()))}`);
        logger.info('Connecting to devices');
        this.devices.forEach(d => d.connect());
        client.close();
        resolve();
      }, timeToDiscover ?? 350);
    });
  }
}
