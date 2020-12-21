import container from "./inversify.config";
type Newable<T> = new (...args: any[]) => T;

export const GetBindingFromContainer = <T>(obj: Newable<T>) => container.get<T>(obj);