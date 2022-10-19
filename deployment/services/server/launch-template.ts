import {
  InstanceType,
  LaunchTemplate,
  LaunchTemplateProps,
  MachineImage,
  SecurityGroup,
  UserData,
  Vpc,
} from 'aws-cdk-lib/aws-ec2'
import * as fs from 'fs'
import { EcsOptimizedImage } from 'aws-cdk-lib/aws-ecs'
import { Role } from 'aws-cdk-lib/aws-iam'
import { Construct } from 'constructs'
import { InstanceTypeIdentifier } from '../../types/instance-types'
import { GLOBAL_SSH_KEY_NAME } from '../../constants'

type Props = {
  vpc: Vpc
  /**
   * If you are using this launch template with ECS, you must include the cluster name.
   * If you don't include this name, your shit won't work. You can get the name by calling:
   @example
   const cluster = new Cluster()
   *clusterName = cluster.clusterName
   */
  ecsClusterName?: string

  /**
   * The same security group that is defined for your ECS Services
   */
  ecsSecurityGroup: SecurityGroup

  /**
   * Regardless of this instances purpose, you will probably need to add
   * some permissions to access other AWS resources.
   */
  role: Role

  instanceType: InstanceTypeIdentifier

  /**
   * If you want to run some shell commands when the container first instantiates
   * you can do so with a shell script. The path given must begin at the directory that contains cdk.json file
   */
  startupShellScriptPath: string

  overrides?: LaunchTemplateProps
}

export const createLaunchTemplate = (scope: Construct, props: Props) => {
  const machineImage = getMachineImage(props)
  const userData = getStartupScript(props)
  const launchTemplate = new LaunchTemplate(scope, 'Ec2LaunchTemplate', {
    instanceType: new InstanceType('t3.micro'),
    // Amazon Linux 2 ECS optimized Images
    role: props.role, // add the role we created (needs access to AWS SM)
    keyName: GLOBAL_SSH_KEY_NAME,
    securityGroup: props.ecsSecurityGroup, // We need to use the same security group as we used for ECS
    detailedMonitoring: false, // detailed monitoring sends metrics every minute, instead of every 5 minutes. Every minute costs $$$$ :(
    machineImage,
    userData,
    ...props.overrides,
  })

  return launchTemplate
}

const getMachineImage = (props: Props) => {
  // If a clustername is given, we know we are going to be using ECS.
  // Thus, we want to use an image optimized for ECS
  if (props.ecsClusterName) return EcsOptimizedImage.amazonLinux2()

  return MachineImage.latestAmazonLinux()
}

const getStartupScript = (props: Props) => {
  // The userData attributes just wants a string of bash commands
  // so we need to encode the file.  This is how we do that.
  const baseStartupScript = fs.readFileSync(
    props.startupShellScriptPath,
    'utf8',
  )

  // If no ECS clustername is given, just return the regular startup script
  if (!props.ecsClusterName) return UserData.custom(baseStartupScript)

  // If we do have an ECS clustername, we need to inject it into a config file
  // during startup.  If we don't do this, then ECS cluster will have no idea it exists
  const addToEcsClusterScript = `echo ECS_CLUSTER=${props.ecsClusterName} >> /etc/ecs/ecs.config`

  // since the startup script is just a string, we can inject another command into it
  return UserData.custom(baseStartupScript + addToEcsClusterScript)
}
