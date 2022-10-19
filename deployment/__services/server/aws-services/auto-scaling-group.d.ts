import { AutoScalingGroup, AutoScalingGroupProps } from 'aws-cdk-lib/aws-autoscaling';
import { SecurityGroup, Vpc } from 'aws-cdk-lib/aws-ec2';
import { Role } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
export declare const createAutoscalingGroup: (scope: Construct, props: {
    identifier: string;
    clusterName: string;
    vpc: Vpc;
    securityGroup: SecurityGroup;
    role: Role;
    overrides?: AutoScalingGroupProps;
}) => {
    ecsEc2AutoscalingGroup: AutoScalingGroup;
    launchTemplate: import("aws-cdk-lib/aws-ec2").LaunchTemplate;
};
