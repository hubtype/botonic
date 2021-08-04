import { getUpdatedObjectsFromPreview } from '../src/aws/cache-invalidator'

const previewOutputWithoutChanges = `
Previewing update (frontend-dev):

    pulumi:pulumi:Stack myProject-frontend-dev running
    pulumi:providers:aws botonic-myProject-dev-aws-provider
    static-webchat-contents botonic-myProject-dev-static-webchat-contents
    aws:s3:Bucket botonic-myProject-dev-webchat-contents-bucket
    pulumi:providers:aws east
    aws:s3:BucketObject index.html  [diff: ~source]
    aws:s3:BucketObject webchat.botonic.js.LICENSE.txt  [diff: ~source]
    aws:s3:BucketObject webchat.botonic.js  [diff: ~source]
    aws:acm:Certificate certificate  [diff: +__defaults]
    aws:route53:Record bot-1.sandbox0.hubtype.com-validation  [diff: +__defaults]
    aws:acm:CertificateValidation certificateValidation  [diff: +__defaults]
    aws:cloudfront:Distribution botonic-myProject-dev-cdn  [diff: ~restrictions,viewerCertificate]
    aws:route53:Record bot-1.sandbox0.hubtype.com  [diff: +__defaults~aliases]
    pulumi:pulumi:Stack myProject-frontend-dev

Resources:
    26 unchanged
`

const previewOutputWithChanges = `
Previewing update (frontend-dev):

    pulumi:pulumi:Stack myProject-frontend-dev running
    pulumi:providers:aws botonic-myProject-dev-aws-provider
    static-webchat-contents botonic-myProject-dev-static-webchat-contents
    aws:s3:Bucket botonic-myProject-dev-webchat-contents-bucket
    pulumi:providers:aws east
    aws:s3:BucketObject index.html  [diff: ~source]
    aws:s3:BucketObject webchat.botonic.js.LICENSE.txt  [diff: ~source]
 ~  aws:s3:BucketObject webchat.botonic.js update [diff: ~source]
    aws:acm:Certificate certificate  [diff: +__defaults]
    aws:route53:Record bot-1.sandbox0.hubtype.com-validation  [diff: +__defaults]
    aws:acm:CertificateValidation certificateValidation  [diff: +__defaults]
    aws:cloudfront:Distribution botonic-myProject-dev-cdn  [diff: ~restrictions,viewerCertificate]
    aws:route53:Record bot-1.sandbox0.hubtype.com  [diff: +__defaults~aliases]
    pulumi:pulumi:Stack myProject-frontend-dev

Resources:
    ~ 1 to update
    25 unchanged
`

it('TEST: Returns an empty list when there are no changes', () => {
  const sut = getUpdatedObjectsFromPreview(previewOutputWithoutChanges)
  expect(sut).toEqual([])
})

it('TEST: Returns list with changed files on changes', () => {
  const sut = getUpdatedObjectsFromPreview(previewOutputWithChanges)
  expect(sut).toEqual(['webchat.botonic.js'])
})
