// Ref: https://github.com/pulumi/examples/tree/master/aws-ts-static-website
import * as aws from '@pulumi/aws'
import * as pulumi from '@pulumi/pulumi'
import * as mime from 'mime'

import {
  REST_SERVER_ENDPOINT_PATH_NAME,
  WEBCHAT_CONTENTS_PATH,
  WEBSOCKET_ENDPOINT_PATH_NAME,
} from '..'
import { crawlDirectory } from '../system-utils'
import {
  AWSComponentResource,
  AWSProvider,
  AWSResourceOptions,
  getAwsProviderConfig,
} from '.'
import { getCachePolicyId, getOriginRequestPolicyId } from './policies'

function getDomainAndSubdomain(
  domain: string
): {
  subdomain: string
  parentDomain: string
} {
  const parts = domain.split('.')
  if (parts.length < 2) {
    throw new Error(`No TLD found on ${domain}`)
  }
  // No subdomain, e.g. awesome-website.com.
  if (parts.length === 2) {
    return { subdomain: '', parentDomain: domain }
  }
  const subdomain = parts[0]
  parts.shift() // Drop first element.
  return {
    subdomain,
    // Trailing "." to canonicalize domain.
    parentDomain: parts.join('.') + '.',
  }
}

function createAliasRecord(
  customDomain: string,
  distribution: aws.cloudfront.Distribution,
  opts: pulumi.ResourceOptions
): aws.route53.Record {
  const domainParts = getDomainAndSubdomain(customDomain)
  const hostedZoneId = aws.route53
    .getZone({ name: domainParts.parentDomain }, { async: true })
    .then(zone => zone.zoneId)
  return new aws.route53.Record(
    customDomain,
    {
      name: domainParts.subdomain,
      zoneId: hostedZoneId,
      type: 'A',
      aliases: [
        {
          name: distribution.domainName,
          zoneId: distribution.hostedZoneId,
          evaluateTargetHealth: true,
        },
      ],
    },
    { ...opts, deleteBeforeReplace: true }
  )
}

function getViewerCertificate(
  customDomain: string | undefined,
  providedCertificateArn: pulumi.Input<string> | undefined,
  opts: pulumi.ResourceOptions
): pulumi.Input<aws.types.input.cloudfront.DistributionViewerCertificate> {
  const defaultViewerCertificateOptions = {
    minimumProtocolVersion: 'TLSv1.1_2016', // TODO: allow to customize
  }
  if (!customDomain) {
    return {
      ...defaultViewerCertificateOptions,
      cloudfrontDefaultCertificate: true,
    }
  }

  let certificateArn = providedCertificateArn
  if (certificateArn === undefined) {
    certificateArn = createCustomDomainCertificate(customDomain, opts)
  }

  return {
    ...defaultViewerCertificateOptions,
    acmCertificateArn: certificateArn,
    sslSupportMethod: 'sni-only',
  }
}

function createCustomDomainCertificate(
  customDomain: string,
  opts: pulumi.ResourceOptions
): pulumi.Output<string> {
  const eastRegion = new aws.Provider(
    'east',
    {
      ...getAwsProviderConfig(),
      region: 'us-east-1', // Per AWS, ACM certificate must be in the us-east-1 region. https://github.com/pulumi/examples/blob/71a705e12b1ea6b132ecf164f0a71adabc78b4ce/aws-ts-static-website/index.ts#L97
    },
    opts
  )

  const certificateConfig: aws.acm.CertificateArgs = {
    domainName: customDomain,
    validationMethod: 'DNS',
    subjectAlternativeNames: [], // TODO: Add the other ones to support
  }

  const certificate = new aws.acm.Certificate(
    'certificate',
    certificateConfig,
    { ...opts, provider: eastRegion }
  )

  const domainParts = getDomainAndSubdomain(customDomain)
  const hostedZoneId = aws.route53
    .getZone({ name: domainParts.parentDomain }, { async: true })
    .then(zone => zone.zoneId)

  const certificateValidationDomain = new aws.route53.Record(
    `${customDomain}-validation`,
    {
      name: certificate.domainValidationOptions[0].resourceRecordName,
      zoneId: hostedZoneId,
      type: certificate.domainValidationOptions[0].resourceRecordType,
      records: [certificate.domainValidationOptions[0].resourceRecordValue],
      ttl: 60 * 1,
    },
    opts
  )

  const validationRecordFqdns = [certificateValidationDomain.fqdn]

  const certificateValidation = new aws.acm.CertificateValidation(
    'certificateValidation',
    {
      certificateArn: certificate.arn,
      validationRecordFqdns: validationRecordFqdns,
    },
    { ...opts, provider: eastRegion }
  )
  return certificateValidation.certificateArn
}
export interface StaticWebchatContentsArgs {
  pathToWebchatContents?: string
  customDomain?: string
  nlpModelsUrl: string
  apiUrl: string
  websocketUrl: string
}
export class StaticWebchatContents extends AWSComponentResource<StaticWebchatContentsArgs> {
  nlpModelsUrl: pulumi.Output<string>
  websocketUrl: pulumi.Output<string>
  apiUrl: pulumi.Output<string>
  webchatUrl: pulumi.Output<string>
  // webviewsUrl: pulumi.Output<string>
  cloudfrontId: pulumi.Output<string>

  constructor(args: StaticWebchatContentsArgs, opts: AWSResourceOptions) {
    super('static-webchat-contents', args, opts)
    const pathToWebchatContents =
      args.pathToWebchatContents || WEBCHAT_CONTENTS_PATH

    const customDomain = args.customDomain

    const contentBucket = new aws.s3.Bucket(
      `${this.namePrefix}-webchat-contents-bucket`,
      {
        acl: 'public-read',
        // ...(customDomain ? { bucket: customDomain } : {}), // TODO: adding customDomain make
      },
      { ...opts, parent: this }
    )
    console.log(
      'Syncing webchat contents from local disk at',
      pathToWebchatContents
    )
    crawlDirectory(pathToWebchatContents, (filePath: string) => {
      const relativeFilePath = filePath.replace(pathToWebchatContents + '/', '')
      const contentFile = new aws.s3.BucketObject(
        relativeFilePath,
        {
          key: relativeFilePath,
          acl: 'public-read',
          bucket: contentBucket,
          contentType: mime.getType(filePath) || undefined,
          source: new pulumi.asset.FileAsset(filePath),
        },
        {
          parent: contentBucket,
        }
      )
    })

    const viewerCertificate = getViewerCertificate(
      customDomain,
      undefined, // TODO: Allow passing custom certificates via config.providerCertificateArn?
      { parent: this }
    )

    const nlpModelsOriginId = 'nlp-models-bucket'
    const botWsApiOriginId = 'bot-ws-api'
    const botRestApiOriginId = 'bot-rest-api'
    const staticContentOriginId = 'static-content-bucket'

    // Path patterns must coincide with bucket structure
    const nlpModelsCacheBehaviors = ['intent-classification', 'ner'].map(e => ({
      pathPattern: `/${e}/*`,
      targetOriginId: nlpModelsOriginId,
      viewerProtocolPolicy: 'redirect-to-https',
      allowedMethods: ['GET', 'HEAD', 'OPTIONS'],
      cachedMethods: ['GET', 'HEAD', 'OPTIONS'],
      cachePolicyId: getCachePolicyId('Managed-CachingOptimized'),
      compress: true,
    }))

    const nlpModelsUrl = new URL(args.nlpModelsUrl)
    const restServerUrl = new URL(args.apiUrl)
    const websocketServerUrl = new URL(args.websocketUrl)

    const distributionArgs: aws.cloudfront.DistributionArgs = {
      enabled: true,

      aliases: customDomain ? [customDomain] : [],
      viewerCertificate: viewerCertificate,
      comment: `Bot ${this.namePrefix}`,

      orderedCacheBehaviors: [
        ...nlpModelsCacheBehaviors,
        {
          pathPattern: `/${REST_SERVER_ENDPOINT_PATH_NAME}/*`,
          targetOriginId: botRestApiOriginId,
          viewerProtocolPolicy: 'redirect-to-https',
          allowedMethods: [
            'GET',
            'HEAD',
            'OPTIONS',
            'PUT',
            'POST',
            'PATCH',
            'DELETE',
          ],
          cachedMethods: ['GET', 'HEAD'],
          forwardedValues: {
            queryString: false,
            headers: [], // setting it to ['*'] will make rest api to not work
            cookies: {
              forward: 'none',
            },
          },
        },
        {
          pathPattern: `/${WEBSOCKET_ENDPOINT_PATH_NAME}/*`,
          targetOriginId: botWsApiOriginId,
          viewerProtocolPolicy: 'redirect-to-https',
          allowedMethods: [
            'GET',
            'HEAD',
            'OPTIONS',
            'PUT',
            'POST',
            'PATCH',
            'DELETE',
          ],
          cachedMethods: ['GET', 'HEAD'],
          forwardedValues: {
            queryString: false,
            headers: [],
            cookies: {
              forward: 'none',
            },
          },
        },
      ],
      defaultCacheBehavior: {
        targetOriginId: staticContentOriginId,
        viewerProtocolPolicy: 'redirect-to-https',
        allowedMethods: ['GET', 'HEAD', 'OPTIONS'],
        cachedMethods: ['GET', 'HEAD', 'OPTIONS'],
        cachePolicyId: getCachePolicyId('Managed-CachingOptimized'),
        // originRequestPolicyId: getOriginRequestPolicyId('Managed-AllViewer'), //TODO: needed?
        compress: true,
      },
      origins: [
        {
          // TODO: Configure bucket as private and use originAccessIdentity: https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html
          originId: staticContentOriginId,
          domainName: contentBucket.bucketRegionalDomainName,
          customOriginConfig: {
            originProtocolPolicy: 'https-only',
            httpPort: 443,
            httpsPort: 443,
            originSslProtocols: ['TLSv1.2'],
          },
        },
        {
          originId: nlpModelsOriginId,
          domainName: nlpModelsUrl.hostname,
          customOriginConfig: {
            originProtocolPolicy: 'https-only',
            httpPort: 443,
            httpsPort: 443,
            originSslProtocols: ['TLSv1.2'],
          },
        },
        {
          originId: botWsApiOriginId,
          domainName: websocketServerUrl.hostname,
          customOriginConfig: {
            originProtocolPolicy: 'https-only',
            httpPort: 443,
            httpsPort: 443,
            originSslProtocols: ['TLSv1.2'],
          },
        },
        // Do not set originPath in below configurations in order to match with current api gateway stages. Ref: https://aws.amazon.com/premiumsupport/knowledge-center/api-gateway-cloudfront-distribution/
        {
          originId: botRestApiOriginId,
          domainName: restServerUrl.hostname,
          customOriginConfig: {
            originProtocolPolicy: 'https-only',
            httpPort: 443,
            httpsPort: 443,
            originSslProtocols: ['TLSv1.2'],
          },
        },
      ],
      defaultRootObject: 'index.html',
      // Support SPA
      // customErrorResponses: [
      //   {
      //     errorCode: 404,
      //     responseCode: 404,
      //     responsePagePath: '/404.html',
      //   },
      // ],
      priceClass: 'PriceClass_100',
      restrictions: {
        geoRestriction: {
          restrictionType: 'none',
        },
      },
      // loggingConfig: TODO: support for hubtype
    }

    const cdn = new aws.cloudfront.Distribution(
      `${this.namePrefix}-cdn`,
      distributionArgs,
      {
        ...opts,
        parent: this,
      }
    )

    if (customDomain) {
      const aRecord = createAliasRecord(customDomain, cdn, { parent: this })
    }
    const domainName = customDomain ? customDomain : cdn.domainName

    this.nlpModelsUrl = pulumi.interpolate`https://${domainName}/`
    this.websocketUrl = pulumi.interpolate`wss://${domainName}/${WEBSOCKET_ENDPOINT_PATH_NAME}/`
    this.apiUrl = pulumi.interpolate`https://${domainName}/${REST_SERVER_ENDPOINT_PATH_NAME}/`
    this.webchatUrl = pulumi.interpolate`https://${domainName}/`
    this.cloudfrontId = cdn.id
    this.registerOutputs({
      cloudfrontId: this.cloudfrontId,
      nlpModelsUrl: this.nlpModelsUrl,
      websocketUrl: this.websocketUrl,
      apiUrl: this.apiUrl,
      webchatUrl: this.webchatUrl,
    })
  }
}

/**
 * customDomain: mybot.mywebsite.com (Hubtype: bot1.bankia.hubtype.com, xxx.bankia.es)
 * - webchat SDK + static assets: static.mybot.mywebsite.com
 * - API REST: api.mybot.mywebsite.com
 * - WS: ws.mybot.mywebsite.com
 * - NLP models bucket?: models.mybot.mywebsite.com
 *     <Image src={MyImage} />
 *     <Image src="./assets/my-image.jpg" />
 */
