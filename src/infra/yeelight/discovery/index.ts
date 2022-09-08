import { GetListIpAddress } from '../../../utils';
import { address } from 'ip';
import { checkPortStatus } from 'portscanner';
import { createSocket } from 'dgram';
import { injectable } from 'inversify';
import { logger } from '../../../shared/Logger';
import Table from 'cli-table';
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
    if (this.devices.length) {
      this._printDevicesTable();
    }
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
        if (this.devices.length) {
          this._printDevicesTable();
        }
        client.close();
        resolve(this.devices);
      }, timeToDiscover ?? 1000);
    });
  }

  private _printDevicesTable() {
    const table = new Table({
      head: ['DeviceID', 'Name', 'IP', 'On?', 'Mode', 'Value', 'Brightness'],
      style: { head: ['green'] },
    });
    this.devices
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
    logger.info('\n' + table.toString(), {
      label: 'Discovery',
    });
  }

  private _handleNewDevices(devices: YeelightDevice[]) {
    const uniqueDevices = [...new Map(devices.map(item => [item.host, item])).values()];
    this.devices = [...uniqueDevices];
  }
}
