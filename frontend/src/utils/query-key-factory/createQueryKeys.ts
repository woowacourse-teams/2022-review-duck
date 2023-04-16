import { QueryKey } from '@tanstack/react-query';

export const createQueryKeys = <
  DomainName extends string,
  QueryName extends string,
  QueryParameters extends Array<any>,
  QuerySchema extends Record<QueryName, (...args: QueryParameters) => QueryKey>,
>(
  domainName: DomainName,
  querySchema: QuerySchema,
) =>
  Object.entries(querySchema).reduce((prev, current) => {
    const queryName = current[0] as QueryName;
    const factoryFunction = current[1] as QuerySchema[QueryName];

    return {
      ...prev,
      [queryName]: (...args: QueryParameters) =>
        [domainName, ...factoryFunction(...args)].filter((value) => value),
    };
  }, {}) as { [K in keyof QuerySchema]: (...args: Parameters<QuerySchema[K]>) => QueryKey };
