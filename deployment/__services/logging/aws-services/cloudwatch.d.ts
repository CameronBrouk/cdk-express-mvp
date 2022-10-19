import { CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';
export declare const logCloudWatch: (scope: Construct, logIdentifier: string, value: string) => CfnOutput;
export declare const logGroup: (scope: Construct, values: Record<string, string | undefined>) => void;
