import { Vpc, VpcProps } from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
declare type Props = {
    identifier: string;
    /**
     * Indicates that there should only be a single, public subnet in this VPC
     * If you want it to be free, this must be true. Otherwise, your shit in private subnets won't be able
     * to talk to each other without a NAT gateway or VPC endpoints.
     * Both of those things cost money(even for free tier accounts).
     * NOTE:  Security Groups allow you to limit access to your resources.
     * because you are not utilizing subnets, you *must* configure them adequately.
     * @default true
     */
    freeTier?: boolean;
    /**
      Normal CDK props for configuring a VPC
      @default undefined
    */
    overrides?: VpcProps;
};
export declare const createVpc: (scope: Construct, props: Props) => Vpc;
export {};
