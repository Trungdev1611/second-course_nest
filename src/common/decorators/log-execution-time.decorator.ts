import { QueryLoggerSubscriber } from '../logger/query';

/**
 * Decorator đo thời gian thực thi của method.
 *
 * @example
 * class BlogRepository {
 *   @LogExecutionTime()
 *   async findAndPaginate() { ... }
 * }
 */
export function LogExecutionTime(label?: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const scopeLabel =
        label || `${target?.constructor?.name || 'Anonymous'}.${propertyKey}`;

      QueryLoggerSubscriber.startScope(scopeLabel);
      try {
        return await originalMethod.apply(this, args);
      } finally {
        QueryLoggerSubscriber.endScope(scopeLabel);
      }
    };

    return descriptor;
  };
}

