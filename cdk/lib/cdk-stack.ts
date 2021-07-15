import { Construct, App, Stack, StackProps, RemovalPolicy } from '@aws-cdk/core'
import { Bucket } from '@aws-cdk/aws-s3'
import { BucketDeployment, Source } from '@aws-cdk/aws-s3-deployment'
import { CloudFrontWebDistribution } from '@aws-cdk/aws-cloudfront'

export class CdkStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props)

    const bucket = new Bucket(this, 'ReactApp', {
      publicReadAccess: true,
      removalPolicy: RemovalPolicy.DESTROY,
      websiteIndexDocument: 'index.html',
    })

    const src = new BucketDeployment(this, 'DeployReactApp', {
      sources: [Source.asset('../build')],
      destinationBucket: bucket
    })

    const cf = new CloudFrontWebDistribution(this, 'ReactAppDistribution', {
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: bucket,
          },
          behaviors: [ {isDefaultBehavior: true} ],
        }
      ]
    })
  }
}
