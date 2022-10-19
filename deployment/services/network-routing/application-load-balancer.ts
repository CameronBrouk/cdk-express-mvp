import { Duration } from 'aws-cdk-lib'
import { Vpc } from 'aws-cdk-lib/aws-ec2'
import {
  ApplicationLoadBalancer,
  IApplicationLoadBalancerTarget,
} from 'aws-cdk-lib/aws-elasticloadbalancingv2'
import { Construct } from 'constructs'

export const createEndpointForService = (
  scope: Construct,
  props: {
    vpc: Vpc
    service: IApplicationLoadBalancerTarget
  },
) => {
  const loadBalancer = new ApplicationLoadBalancer(scope, 'LoadBalancer', {
    vpc: props.vpc,
    internetFacing: true,
  })

  const listener = loadBalancer.addListener('PublicListener', {
    port: 80,
    open: true,
  })

  const listenerTarget = listener.addTargets('ListenerTargets', {
    port: 80,
    // targets: [],
    targets: [props.service],
    // include health check (default is none)
    healthCheck: {
      interval: Duration.seconds(30),
      path: '/',
      timeout: Duration.seconds(5),
    },
  })

  return { loadBalancer, listener, listenerTarget }
}
