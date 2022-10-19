import { InstanceClass, InstanceSize } from 'aws-cdk-lib/aws-ec2';
declare type instanceClass = `${InstanceClass}`;
declare type instanceSize = `${InstanceSize}`;
export declare type InstanceTypeIdentifier = `${instanceClass}.${instanceSize}`;
export {};
