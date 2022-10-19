import { CfnOutput } from 'aws-cdk-lib'
import { Construct } from 'constructs'

export const logCloudWatch = (
  scope: Construct,
  logIdentifier: string,
  value: string,
) =>
  new CfnOutput(scope, `${logIdentifier}`, {
    value,
  })

export const logGroup = (
  scope: Construct,
  values: Record<string, string | undefined>,
) =>
  Object.entries(values).forEach(([identifier, value]) => {
    if (!value) return
    new CfnOutput(scope, identifier, { value })
  })
