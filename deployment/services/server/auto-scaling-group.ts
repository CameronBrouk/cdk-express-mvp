import {
  AutoScalingGroup,
  AutoScalingGroupProps,
  UpdatePolicy,
} from 'aws-cdk-lib/aws-autoscaling'
import { SecurityGroup, SubnetType, Vpc } from 'aws-cdk-lib/aws-ec2'
import { Cluster } from 'aws-cdk-lib/aws-ecs'
import { Role } from 'aws-cdk-lib/aws-iam'
import { Construct } from 'constructs'
import { createLaunchTemplate } from './launch-template'

export const createAutoscalingGroup = (
  scope: Construct,
  props: {
    identifier: string
    clusterName: string
    vpc: Vpc
    securityGroup: SecurityGroup
    role: Role
    overrides?: AutoScalingGroupProps
  },
) => {
  const { clusterName, vpc, securityGroup, role } = props

  // This launchtemplate includes a clusterName, which optimizes it
  // for ECS.
  const launchTemplate = createLaunchTemplate(scope, {
    ecsClusterName: clusterName,
    ecsSecurityGroup: securityGroup,
    startupShellScriptPath: 'scripts/template-startup.sh',
    role,
    vpc,
    instanceType: 't3.micro',
  })

  // Security Group is set based on the Launch Template
  const ecsEc2AutoscalingGroup = new AutoScalingGroup(
    scope,
    `AutoscalingServers`,
    {
      vpc: props.vpc,
      launchTemplate,
      // we only want one instance in our cluster(to stay in free tier)
      minCapacity: 1, // Minimum instances we can scale from
      desiredCapacity: 1, // How many will be running at any given time?
      maxCapacity: 1, // Assuming it's needed, what is the maximum instances we can scale to?
      // Container instances need access to communicate with the Amazon ECS service endpoint.
      vpcSubnets: { subnetType: SubnetType.PUBLIC },
      ...props.overrides,
    },
  )

  return { ecsEc2AutoscalingGroup, launchTemplate }
}
