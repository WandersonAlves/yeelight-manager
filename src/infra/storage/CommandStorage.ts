import { LocalStorage } from 'node-localstorage';
import { join } from 'path';
import { logger } from '../../shared/Logger';
import Table from 'cli-table3';

export default class CommandStorage {
  private static storageFolder = join(__dirname, '../../../localStorage');
  private static storage = new LocalStorage(CommandStorage.storageFolder);

  static save(str: string, rawString: string) {
    logger.verbose(`LocalStorage are on ${CommandStorage.storageFolder}`);
    return this.storage.setItem(str, rawString);
  }

  static load(str: string) {
    logger.verbose(`LocalStorage are on ${CommandStorage.storageFolder}`);
    return this.storage.getItem(str);
  }

  static getAll() {
    const table = new Table({
      head: ['Name', 'Command'],
      style: { head: ['green'] },
    });
    new Array(this.storage.length).fill(0).forEach((_, index) => {
      const key = this.storage.key(index);
      table.push([key, this.storage.getItem(key)]);
    });
    logger.verbose(`LocalStorage are on ${CommandStorage.storageFolder}`);
    logger.info('Saved commands:\n' + table.toString());
  }
}
