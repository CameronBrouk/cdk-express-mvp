import * as cdk from 'aws-cdk-lib'
import { FreeTierBackend } from '../constructs/free-tier-backend'

export class UnimpairedStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, {
      ...props,
      // env: {
      //   region: 'us-west-2',
      //   account: '941447230352',
      // },
      tags: {
        Project: 'StlSwingTestDeploy',
        DeployedBy: 'Cameron',
      },
    })

    new FreeTierBackend(this, 'SwingDev', { stage: 'Dev', title: 'Swing' })
  }
}
