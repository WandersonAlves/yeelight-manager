/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { logger } from '../Logger';

export default function ExceptionHandler(customFn?: (e: Error) => any) {
  return (target: unknown, name: unknown, descriptor: PropertyDescriptor) => {
    const original = descriptor.value;
    descriptor.value = async function (...args) {
      try {
        return await original.apply(this, args);
      } catch (err) {
        logger.error(err);
        if (customFn) {
          return customFn(err);
        }
        process.exit(1);
      }
    };
    return descriptor;
  };
}
