import { LocalStorage } from 'node-localstorage';
import { join } from 'path';

export default class CommandStorage {
  private static storage = new LocalStorage(join(__dirname));

  static save(str: string, rawString: string) {
    return this.storage.setItem(str, rawString);
  }

  static load(str: string) {
    return this.storage.getItem(str);
  }
}
