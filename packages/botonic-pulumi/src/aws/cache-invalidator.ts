import { CloudFront, CloudFrontClientConfig } from '@aws-sdk/client-cloudfront'
import { Credentials } from '@aws-sdk/types'

import { AWSCredentials } from '../pulumi-runner'

export const INVALIDATION_PATH_PREFIX = '/'
export class CacheInvalidator {
  client: CloudFront
  constructor(awsConfig: AWSCredentials) {
    const cfClientConfig: CloudFrontClientConfig = {
      region: awsConfig.region,
    }
    const credentials = this.resolveCredentials(awsConfig)
    if (credentials) cfClientConfig.credentials = credentials
    this.client = new CloudFront(cfClientConfig)
  }

  resolveCredentials(awsConfig: AWSCredentials): Credentials | undefined {
    const credentials = {}
    if (awsConfig.accessKey && awsConfig.secretKey) {
      credentials['accessKeyId'] = awsConfig.accessKey
      credentials['secretAccessKey'] = awsConfig.secretKey
    }
    if (awsConfig.token) {
      credentials['sessionToken'] = awsConfig.token
    }
    if (Object.keys(credentials).length > 0) {
      return credentials as Credentials
    }
    return undefined
  }

  async invalidateBucketObjects(
    distributionId: string,
    pathPrefix = INVALIDATION_PATH_PREFIX,
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

export function getUpdatedObjectsFromPreview(previewStdout: string): string[] {
  try {
    const updatedObjectsRegex = /.*aws:s3:BucketObject(.*)update/
    return previewStdout
      .trim()
      .split('\n')
      .map(e => e.trim())
      .filter(e => e.startsWith('~') && e.includes('aws:s3:BucketObject'))
      .map((e: string) => {
        const res = updatedObjectsRegex.exec(e)
        if (!res) return ''
        return res[1].trim()
      })
      .filter(e => Boolean(e) && e)
  } catch (e) {
    return []
  }
}
