import { CloudFront } from '@aws-sdk/client-cloudfront'

import { AWSCredentials } from '../pulumi-runner'

export class CacheInvalidator {
  awsConfig: AWSCredentials
  client: CloudFront

  constructor(awsConfig: AWSCredentials) {
    this.awsConfig = awsConfig
    // TODO: What more credentials have to be used here?
    this.client = new CloudFront({
      region: awsConfig.region,
    })
  }

  async invalidateBucketObjects(
    distributionId: string,
    pathPrefix = '/',
    bucketObjects: string[]
  ): Promise<void> {
    const itemsToInvalidate = bucketObjects.map(e => `${pathPrefix}${e}`)
    console.log('Running cache invalidations on updated files...')
    await this.client.createInvalidation({
      DistributionId: distributionId,
      InvalidationBatch: {
        CallerReference: new Date().toISOString(),
        Paths: {
          Items: itemsToInvalidate,
          Quantity: itemsToInvalidate.length,
        },
      },
    })
  }
}
