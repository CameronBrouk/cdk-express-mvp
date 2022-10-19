import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { ApplicationLoadBalancer, IApplicationLoadBalancerTarget } from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { Construct } from 'constructs';
export declare const createEndpointForService: (scope: Construct, props: {
    vpc: Vpc;
    service: IApplicationLoadBalancerTarget;
}) => {
    loadBalancer: ApplicationLoadBalancer;
    listener: import("aws-cdk-lib/aws-elasticloadbalancingv2").ApplicationListener;
    listenerTarget: import("aws-cdk-lib/aws-elasticloadbalancingv2").ApplicationTargetGroup;
};
