import {
  Ec2TaskDefinition,
  EcrImage,
  NetworkMode,
  Secret,
} from 'aws-cdk-lib/aws-ecs'
import { Construct } from 'constructs'
import { createLogDriver } from '../logging/log-driver'
import { createRole } from '../resource-permissions/identity-access-management'

type Props = {
  /**
   * The Record Key is the name of the Environment variable that will be injected into the docker container
   * The record value is the AWS Secret Manager value
   * @example
    import * as ssm from 'aws-cdk-lib/aws-secretsmanager'
    import * as ecs from 'aws-cdk-lib/aws-ecs'
    const database = new DatabaseInstance()
    const stripePrivateKey = new ssm.Secret()
    const taskDefinition = createTaskDefinition(this, '', {
      secrets: {
        "DATABASE_PASSWORD": ecs.Secret.fromSecretsManager(database.secret, "password")
        "DATABASE_USERNAME": ecs.Secret.fromSecretsManager(database.secret, "username")
        // this would fail, because it isn't an ecs secret
        "STRIPE_KEY": stripePrivateKey,
      }
    })
    // ==========================================
    // meanwhile, inside of your running container...
    echo $STRIPE_KEY
    echo $DATABASE_PASSWORD
    echo $DATABASE_USERNAME
   */
  secrets?: { [key: string]: Secret }
  environment?: Record<string, string>
  image: EcrImage
}
export const createTaskDefinition = (scope: Construct, props: Props) => {
  const logDriver = createLogDriver(scope, {
    cdkIdentifier: 'DockerContainerLogGroup',
    logGroupName: 'docker-container-logs',
    prefix: 'container',
  })

  const taskDefinition = new Ec2TaskDefinition(scope, 'TaskDef', {
    networkMode: NetworkMode.AWS_VPC,
    taskRole: createRole(scope, 'DockerAccessSecrets', {
      forServices: ['ecs-tasks.amazonaws.com'],
      permissionsGranted: [
        'AmazonSSMManagedInstanceCore',
        'SecretsManagerReadWrite',
      ],
    }),
  })

  const container = taskDefinition.addContainer('ApiDockerContainer', {
    image: props.image,
    cpu: 512,
    memoryReservationMiB: 256,
    portMappings: [{ containerPort: 80 }],
    logging: logDriver,
    secrets: props.secrets,
    environment: props.environment,
  })

  return taskDefinition
}
