import { DataProvider } from './data-provider'
import { DynamoDBDataProvider } from './dynamodb-data-provider'
import { LocalDevDataProvider } from './local-data-provider'

export const dataProviderProtocols = {
  DYNAMO_DB: 'dynamodb',
  FILE: 'file',
}

/** URL examples:
 * dynamodb://my-table.my-region.aws.com
 * postgresql://my-database.my-db-provider.com
 * file://path/to/local/db.json
 */
export function dataProviderFactory(url?: string): DataProvider {
  if (!url) {
    return new LocalDevDataProvider()
  }

  const protocol = url.split('://')[0]
  switch (protocol) {
    case dataProviderProtocols.DYNAMO_DB:
      return new DynamoDBDataProvider(url)
    case dataProviderProtocols.FILE:
      return new LocalDevDataProvider(url)
    default:
      console.error(
        `Protocol ${protocol} not implemented, using local DB instead.`
      )
      return new LocalDevDataProvider()
  }
}
