import { GetListIpAddress } from '../../../utils';
import { address } from 'ip';
import { checkPortStatus } from 'portscanner';
import { createSocket } from 'dgram';
import { injectable } from 'inversify';
import { logger } from '../../../shared/Logger';
import YeelightDevice from '../devices/YeelightDevice';

@injectable()
export default class Discovery {
  private devices: YeelightDevice[] = [];
  private static SSDPDiscoveryMessage = `M-SEARCH * HTTP/1.1\r\nnMAN: "ssdp:discover"\r\nST: wifi_bulb\r\n`;
  private static SSDPPort = 1982;
  private static SSDPHost = '239.255.255.250';

  findDevice(idOrNameOrIp: string): YeelightDevice {
    return this.devices.find(d => d.id === idOrNameOrIp || d.name === idOrNameOrIp || d.host === idOrNameOrIp);
  }

  getDevices(): YeelightDevice[] {
    return this.devices;
  }

  async discoverDevicesFallback() {
    const ips = GetListIpAddress(address());
    const promises = ips.map(
      ip =>
        new Promise<{ ip: string; status: string }>(resolve => {
          checkPortStatus(YeelightDevice.YeelightDefaultPort, ip, (err, status) => {
            if (err || status === 'closed') {
              return resolve(null);
            }
            return resolve({ ip, status });
          });
        }),
    );
    const openDevices = await Promise.all(promises);

    this._handleNewDevices(openDevices.filter(d => d).map(d => YeelightDevice.CreateDeviceByIp(d.ip, 55443)));
    return this.devices;
  }

  discoverDevices(timeToDiscover?: number): Promise<YeelightDevice[]> {
    return new Promise((resolve, reject) => {
      const client = createSocket('udp4');
      const devices: YeelightDevice[] = [];

      client.send(Discovery.SSDPDiscoveryMessage, Discovery.SSDPPort, Discovery.SSDPHost, error => {
        if (error) {
          logger.error(error.toString(), { label: 'Discovery' });
          client.close();
          reject(error);
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
        this._handleNewDevices(devices);
        client.close();
        resolve(this.devices);
      }, timeToDiscover ?? 1000);
    });
  }

  private _handleNewDevices(devices: YeelightDevice[]) {
    const uniqueDevices = [...new Map(devices.map(item => [item.host, item])).values()];
    this.devices = [...uniqueDevices];
    this.devices.forEach(d =>
      logger.info(`YeelightID: ${d.id} | Name: ${d.name || 'UnamedYeelight'} | IP: ${d.host}:${d.port}`, { label: 'Discovery' }),
    );
  }
}
