import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { TaskDefinition } from 'aws-cdk-lib/aws-ecs';
import { ApplicationLoadBalancedEc2Service } from 'aws-cdk-lib/aws-ecs-patterns';
import { Construct } from 'constructs';
import { InstanceTypeIdentifier } from '../../../../types/instance-types';
import { DomainInfo } from '../../../domains/aws-services/route-53';
declare type Props = {
    vpc: Vpc;
    taskDefinition: TaskDefinition;
    instanceType: InstanceTypeIdentifier;
    domainInfo: DomainInfo['api'];
};
export declare const createEcsService: (scope: Construct, props: Props) => ApplicationLoadBalancedEc2Service;
export {};
