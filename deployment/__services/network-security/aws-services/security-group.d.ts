import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import { DEVELOPERS } from '../../../constants';
export declare type Ipv4Address = `${number}.${number}.${number}.${number}`;
export declare type CidrBlock = `${Ipv4Address}/${number}`;
declare type ipv4Type = 'http' | 'https';
declare type InternetAllowance = `allow-all-${ipv4Type}` | `allow-all-${ipv4Type}-in-vpc`;
declare type Props = {
    identifier: string;
    description: string;
    vpc: Vpc;
    internetAccess?: {
        ssl?: boolean;
        outbound: {} | InternetAllowance;
        inbound: {} | InternetAllowance;
    } | InternetAllowance;
    sshAccess?: {
        allowedIpAddresses?: Ipv4Address[];
        allowedDevelopers?: (keyof typeof DEVELOPERS)[];
    } | 'allow-all-developers';
};
export declare const createSecurityGroup: (scope: Construct, props: Props) => ec2.SecurityGroup;
export {};
