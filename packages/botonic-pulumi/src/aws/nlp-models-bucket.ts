// Ref: https://github.com/pulumi/examples/tree/master/aws-ts-static-website
import * as aws from '@pulumi/aws'
import * as pulumi from '@pulumi/pulumi'

import { NLP_MODELS_PATH } from '..'
import { crawlDirectory } from '../system-utils'
import { AWSComponentResource, AWSResourceOptions } from '.'

export interface NLPModelsBucketArgs {
  nlpModelsPath?: string
}

export class NLPModelsBucket extends AWSComponentResource<NLPModelsBucketArgs> {
  endpoint: pulumi.Output<string>
  constructor(args: NLPModelsBucketArgs, opts: AWSResourceOptions) {
    super('nlp-models-bucket', args, opts)
    const nlpModelsPath = args.nlpModelsPath || NLP_MODELS_PATH

    const nlpModelsBucket = new aws.s3.Bucket(
      `${this.namePrefix}-models-bucket`,
      {
        acl: 'public-read',
      },
      { ...opts, parent: this }
    )

    console.log('Syncing NLP Models from local disk at', nlpModelsPath)
    crawlDirectory(nlpModelsPath, (filePath: string) => {
      if (filePath.endsWith('.ts')) return // do not upload ts scripts
      const relativeFilePath = filePath.replace(nlpModelsPath + '/', '')
      const contentFile = new aws.s3.BucketObject(
        relativeFilePath,
        {
          key: relativeFilePath,
          acl: 'public-read',
          bucket: nlpModelsBucket,
          source: new pulumi.asset.FileAsset(filePath),
        },
        {
          parent: nlpModelsBucket,
        }
      )
    })

    this.endpoint = pulumi.interpolate`https://${nlpModelsBucket.bucketRegionalDomainName}`
    this.registerOutputs({
      endpoint: this.endpoint,
    })
  }
}
