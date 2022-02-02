import { LocalStorage } from 'node-localstorage';
import { join } from 'path';
import { logger } from '../../shared/Logger';
import Table from 'cli-table';

export default class CommandStorage {
  private static storage = new LocalStorage(join(__dirname, '../../../localStorage'));

  static save(str: string, rawString: string) {
    return this.storage.setItem(str, rawString);
  }

  static load(str: string) {
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
    logger.info('\n' + table.toString());
  }
}
