import { InstanceClass, InstanceSize, InstanceType } from 'aws-cdk-lib/aws-ec2'

type instanceClass = `${InstanceClass}`
type instanceSize = `${InstanceSize}`

export type InstanceTypeIdentifier = `${instanceClass}.${instanceSize}`
