import { AutoScalingGroup } from 'aws-cdk-lib/aws-autoscaling'
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager'
import {
  InstanceType,
  Protocol,
  SecurityGroup,
  SubnetType,
  Vpc,
} from 'aws-cdk-lib/aws-ec2'
import {
  AsgCapacityProvider,
  Cluster,
  DeploymentControllerType,
  Ec2Service,
  EcsOptimizedImage,
  PropagatedTagSource,
  TaskDefinition,
} from 'aws-cdk-lib/aws-ecs'
import { ApplicationLoadBalancedEc2Service } from 'aws-cdk-lib/aws-ecs-patterns'
import { ApplicationProtocol } from 'aws-cdk-lib/aws-elasticloadbalancingv2'
import { HostedZone } from 'aws-cdk-lib/aws-route53'
import { Construct } from 'constructs'
import { GLOBAL_SSH_KEY_NAME } from '../../constants'
import { InstanceTypeIdentifier } from '../../types/instance-types'
import { DomainInfo } from '../../__services/domains/aws-services/route-53'

type Props = {
  vpc: Vpc
  taskDefinition: TaskDefinition
  instanceType: InstanceTypeIdentifier
  domainInfo: DomainInfo['api']
}

export const createEcsService = (scope: Construct, props: Props) => {
  // Create an ECS cluster
  const cluster = new Cluster(scope, `EcsCluster`, {
    vpc: props.vpc,
    containerInsights: true,
    capacity: {
      instanceType: new InstanceType(props.instanceType),
      keyName: GLOBAL_SSH_KEY_NAME,
      minCapacity: 1,
      desiredCapacity: 1,
      maxCapacity: 5,
      canContainersAccessInstanceRole: true,
      allowAllOutbound: true,
      machineImage: EcsOptimizedImage.amazonLinux2(),
      vpcSubnets: {
        subnetType: SubnetType.PUBLIC,
      },
    },
  })

  const { certificate, domain, zone } = props.domainInfo
  const service = new ApplicationLoadBalancedEc2Service(scope, 'EcsService', {
    cluster,
    taskDefinition: props.taskDefinition,
    openListener: true,
    desiredCount: 1,
    publicLoadBalancer: true,
    domainName: domain,
    domainZone: zone,
    certificate,
    propagateTags: PropagatedTagSource.TASK_DEFINITION,
  })

  return service
}
