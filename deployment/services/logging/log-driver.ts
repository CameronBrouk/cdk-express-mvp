import { RemovalPolicy } from 'aws-cdk-lib'
import { AwsLogDriver } from 'aws-cdk-lib/aws-ecs'
import { LogGroup, RetentionDays } from 'aws-cdk-lib/aws-logs'
import { Construct } from 'constructs'

type Props = {
  cdkIdentifier: string
  logGroupName: string
  prefix: string
}
export const createLogDriver = (scope: Construct, props: Props) => {
  return AwsLogDriver.awsLogs({
    logGroup: new LogGroup(scope, props.cdkIdentifier, {
      retention: RetentionDays.FIVE_DAYS,
      removalPolicy: RemovalPolicy.DESTROY,
      logGroupName: props.logGroupName,
    }),
    streamPrefix: props.prefix,
    multilinePattern: '^(INFO|DEBUG|WARN|ERROR|CRITICAL|SELECT|PRISMA)', // https://stackoverflow.com/questions/67396522/cloudwatch-multiline-log-messages-from-containerized-app-runnning-on-ecs-ec2
    // mode: AwsLogDriverMode.BLOCKING, // Logs are prioritized over the application -> https://dalefro.medium.com/non-blocking-docker-logging-ebd3e1a1e89d
  })
}
