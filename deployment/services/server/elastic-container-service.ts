import { AutoScalingGroup } from 'aws-cdk-lib/aws-autoscaling'
import { SecurityGroup, SubnetType } from 'aws-cdk-lib/aws-ec2'
import {
  AsgCapacityProvider,
  Cluster,
  DeploymentControllerType,
  Ec2Service,
  PropagatedTagSource,
  TaskDefinition,
} from 'aws-cdk-lib/aws-ecs'
import { Construct } from 'constructs'

export const createBaseService = (
  scope: Construct,
  props: {
    autoScalingGroup: AutoScalingGroup
    ecsSecurityGroup: SecurityGroup
    cluster: Cluster
    taskDefinition: TaskDefinition
  },
) => {
  const ec2GroupCapacityProvider = new AsgCapacityProvider(
    scope,
    'GroupCapacityProvider',
    {
      autoScalingGroup: props.autoScalingGroup,
      canContainersAccessInstanceRole: true,
      enableManagedTerminationProtection: false,
    },
  )

  // We must add a capacity provider to the cluster in order to make it work with an ec2 autoscaling group
  props.cluster.addAsgCapacityProvider(ec2GroupCapacityProvider)

  const ecsService = new Ec2Service(scope, 'EcsService', {
    cluster: props.cluster,
    taskDefinition: props.taskDefinition,
    // If we are using an autoscaling group, we need to do this.
    propagateTags: PropagatedTagSource.TASK_DEFINITION,
    capacityProviderStrategies: [
      {
        capacityProvider: ec2GroupCapacityProvider.capacityProviderName,
        base: 1, // if you do not include a base when using a capacity provider, CDK will error
        weight: 100, // If you do not include a weight when using a capacity provider, CDK will error
      },
    ],
    // Only run one task / ec2 instance. i.e. each ec2 instance acts as it's own application
    // Note:  On deployments, we will deploy another ec2 instance for a moment(adding costs), but it will replace the previous instance
    daemon: true,
    deploymentController: {
      type: DeploymentControllerType.ECS,
    },
    securityGroups: [props.ecsSecurityGroup],
    vpcSubnets: { subnetType: SubnetType.PUBLIC },
  })

  return {
    ecsService,
    ec2GroupCapacityProvider,
  }
}
