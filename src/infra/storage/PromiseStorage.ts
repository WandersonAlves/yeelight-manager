import { RejectFn, ResolveFn } from "../../shared/contracts";
import Command from "../yeelight/devices/Commands";

export interface PromiseData {
  cmd: Command & {ack: boolean};
  resolve: ResolveFn;
  reject: RejectFn;
}

export default class PromiseStorage {
  private _promiseList: PromiseData[] = [];

  add(obj: PromiseData) {
    this._promiseList.push(obj);
  }

  has(cmdId: number): boolean {
    return this._promiseList.find(p => p.cmd.id === cmdId) ? true : false;
  }

  getAck(cmdId: number): boolean {
    return this._promiseList.find(p => p.cmd.id === cmdId).cmd.ack;
  }

  setAck(cmdId: number, ack: boolean) {
    return this._promiseList.find(p => p.cmd.id === cmdId).cmd.ack = ack;
  }

  resolve(cmdId: number) {
    const promiseData = this._promiseList.find(p => p.cmd.id === cmdId);
    this._promiseList.filter(p => p.cmd.id !== cmdId);
    return promiseData.resolve();
  }

  reject(cmdId: number, err: Error) {
    const promiseData = this._promiseList.find(p => p.cmd.id === cmdId);
    this._promiseList.filter(p => p.cmd.id !== cmdId);
    return promiseData.reject(err);
  }
}