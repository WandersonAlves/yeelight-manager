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
  private static readonly SSDPDiscoveryMessage = `M-SEARCH * HTTP/1.1\r\nnMAN: "ssdp:discover"\r\nST: wifi_bulb\r\n`;
  private static readonly SSDPPort = 1982;
  private static readonly SSDPHost = '239.255.255.250';

  findDevice(idOrNameOrIp: string): YeelightDevice {
    return this.devices.find(d => d.id === idOrNameOrIp || d.name === idOrNameOrIp || d.host === idOrNameOrIp);
  }

  getDevices(): YeelightDevice[] {
    return this.devices;
  }

  async turnOnAll(devices?: YeelightDevice[]) {
    return Promise.all((devices ?? this.devices).filter(d => !d.power).map(d => d.setPower('on')));
  }

  async musicModeAll(ipAddress: string, devices?: YeelightDevice[]) {
    return Promise.all((devices ?? this.devices).map(d => d.startMusicMode(ipAddress)));
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

    this._handleNewDevices(openDevices.filter(d => d).map(d => YeelightDevice.CreateDeviceByIp(d.ip)));
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
  }
}
