import { IntegerToRgb } from '../../../utils';
import { UseCase } from '../../../shared/contracts';
import { inject, injectable } from 'inversify';
import { logger } from '../../../shared/Logger';
import DiscoverDevicesCase from '../DiscoverDevices/DiscoverDevicesCase';
import Table from 'cli-table3';
import chalk from 'chalk';

@injectable()
export default class ListDevicesCase implements UseCase<void, void> {

    @inject(DiscoverDevicesCase) private discoveryDevicesCase: DiscoverDevicesCase;

    async execute(): Promise<void> {
        const devices = await this.discoveryDevicesCase.execute();
        const table = new Table({
            head: ['DeviceID', 'Name', 'IP', 'On?', 'Mode', 'Value', 'Brightness'],
            style: { head: ['green'] },
        });
        devices
            .sort((a, b) => (a.name < b.name ? -1 : 1))
            .forEach((d) => {
                const { id, name = 'UnnamedYeelight', host, port, power, colorMode, bright, rgbValue, colorTemperatureValue } = d.toObject();
                let value: string | number = colorMode === 'RGB' ? rgbValue : colorTemperatureValue;
                if (colorMode === 'RGB') {
                    const [r, g, b] = IntegerToRgb(value);
                    value = chalk.rgb(r, g, b)`${value}`;
                } else {
                    value = colorTemperatureValue;
                }
                // logger.info(`\nDeviceId: ${id}\nName: ${name}\nIp: ${host}:${port}\nOn?: ${power ? `🔋` : `🪫`}\nMode: ${colorMode} - Value: ${value} - Brightness: ${bright}`);
                table.push([id, name, `${host}:${port}`, power ? `🔋` : `🪫`, colorMode, value, bright]);
            });
        logger.info('Devices found:\n' + table.toString(), {
            label: 'Discovery',
        });
    }
}
