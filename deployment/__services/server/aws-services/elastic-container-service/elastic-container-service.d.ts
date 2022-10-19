import { AutoScalingGroup } from 'aws-cdk-lib/aws-autoscaling';
import { SecurityGroup } from 'aws-cdk-lib/aws-ec2';
import { AsgCapacityProvider, Cluster, Ec2Service, TaskDefinition } from 'aws-cdk-lib/aws-ecs';
import { Construct } from 'constructs';
export declare const createBaseService: (scope: Construct, props: {
    autoScalingGroup: AutoScalingGroup;
    ecsSecurityGroup: SecurityGroup;
    cluster: Cluster;
    taskDefinition: TaskDefinition;
}) => {
    ecsService: Ec2Service;
    ec2GroupCapacityProvider: AsgCapacityProvider;
};
