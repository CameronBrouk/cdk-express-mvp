import * as cdk from 'aws-cdk-lib'
import { Duration } from 'aws-cdk-lib'
import * as ec2 from 'aws-cdk-lib/aws-ec2'
import { Vpc } from 'aws-cdk-lib/aws-ec2'
import * as ecs from 'aws-cdk-lib/aws-ecs'
import * as rds from 'aws-cdk-lib/aws-rds'
import { DatabaseInstance, DatabaseInstanceProps } from 'aws-cdk-lib/aws-rds'
import { ISecret } from 'aws-cdk-lib/aws-secretsmanager'
import { Construct } from 'constructs'
import { InstanceTypeIdentifier } from '../../types/instance-types'
import { createSecurityGroup } from '../network-security/security-group'

/**
  - Settings
    - instance:  t3.micro
    - type: postgres
  - Credentials: A Json string that resolves to:
    - "engine": "postgres",
    - "host": "<instance host name/resolvable DNS name>",
    - "username": "<username. if not specified, defaults to 'admin'",
    - "password": "<password. generated/rotated by aws secrets manager",
    - "dbname": "<database name. If not specified, defaults to 'postgres'>",
    - "port": "<TCP port number. If not specified, defaults to 5432>"
  - Cost
    - free tier:  $0/mo
    - after: $30(ish)/mo
  - Network Security
    - Only allows traffic from within VPC on Port 5432
  - Monitoring
    - both performanceInsights and enhancedMonitoring are set by default
    - "Performance Insights" checks the database load
        - docs: https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PerfInsights.html
    - "Enhanced Monitoring" checks CPU usage in the DB operating System
        - docs: https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_Monitoring.OS.html
 */
type subnetType = 'public' | 'private' | 'isolated'

type Props = {
  instanceType: InstanceTypeIdentifier
  vpc: Vpc
  databaseName: string
  subnetType: subnetType
  overrides?: DatabaseInstanceProps
}
export const createDatabase = (scope: Construct, props: Props) => {
  const databaseSecurityGroup = createSecurityGroup(scope, {
    identifier: 'DatabaseSecurityGroup',
    description: 'Database Security Group',
    vpc: props.vpc,
  })

  const database = new rds.DatabaseInstance(scope, `Database`, {
    // should be true but I'm retarded and
    // will probably need to see the prod db to debug dumbass user problems
    storageEncrypted: false,

    // RDS INSTANCE SETTINGS
    // optional, defaults to m5.large(what the fuck?)
    // You get a single persistent database t3.micro for free under aws free tier
    // t3.micro gives 2 Vcpu and 1 gig of memory
    instanceType: new ec2.InstanceType('t3.micro'),
    // Set as Postgres
    engine: rds.DatabaseInstanceEngine.postgres({
      version: rds.PostgresEngineVersion.VER_14_3, // Most recent version of Postgres(prisma supports it)
    }),
    allowMajorVersionUpgrade: false, // If true, we might have an upgrade made that breaks our ORM
    autoMinorVersionUpgrade: true,
    // You get 20GB of storage under the AWS Free tier
    allocatedStorage: 20,
    multiAz: false, // Making this true is TECHNICALLY better, but it cost way more money
    storageType: rds.StorageType.GP2, // required for free tier

    removalPolicy: cdk.RemovalPolicy.DESTROY,
    // If we ever fat finger a cdk deploy and delete our database,
    // We want our backups to exist.  Even in dev.
    // Note that, by default, 1 backup is created every day.
    // This backup is also only retained for 1 day,
    deleteAutomatedBackups: false,

    // You get 7 days of free performance data
    performanceInsightRetention: 7,
    enablePerformanceInsights: true,
    // Optional Values are:  1, 5, 10, 15, 30, or 60
    // Note:  This is free until you hit cloudwatch limits
    monitoringInterval: Duration.seconds(30),
    // By default, the log retention is 'Forever'.
    // To keep within the free tier, we set it to 7 days.
    // Performance monitoring should be an active thing you do
    // during peak times.  It's not THAT important to know performance
    // from a year ago.  Mostly you want to look at this when
    // your web application shits the bed because you never bothered to
    // check the logs and didn't notice that you were 1 user away from
    // running out of memory/cpu
    cloudwatchLogsRetention: 7,
    databaseName: props.databaseName,
    vpc: props.vpc,
    securityGroups: [databaseSecurityGroup],
    // The credentials must have a 'username' and 'password' property
    vpcSubnets: {
      // If you don't want a NAT Gateway(which we don't), You must set this.
      // If you don't set this and you set 'natgateways' to zero in your vpc,
      // Everything will shit the bed and it will say 'there are no private networks in your vpc'
      // Fucking amazon bullshit about tricking people into spending money.  fucking dumb.
      subnetType: getSubnetType('public'),
    },
  })

  return database
}

const getSubnetType = (type: subnetType) => {
  const types = ec2.SubnetType
  if (type === 'private') return types.PRIVATE_WITH_EGRESS
  if (type === 'isolated') return types.PRIVATE_ISOLATED
  return types.PUBLIC
}

type DBSecretFields =
  | 'host'
  | 'port'
  | 'dbinstanceidentifier'
  | 'username'
  | 'password'
export const getDbSecretJson =
  (database: DatabaseInstance) => (field: DBSecretFields) => {
    if (!database.secret) throw 'No Database Secret Created'
    return ecs.Secret.fromSecretsManager(database.secret, field)
  }

// export const getPrismaConnectionDbUrlFromSecret = (secret: Secret) => {
//   const getSecret = getDbSecretJson(secret)
//   const password = getSecret('password')
//   const username = getSecret('username')
//   const host = getSecret('host')
//   const port = getSecret('port')
//   const identifier = getSecret('dbinstanceidentifier')

//   return `postgresql://${username}:${password}@${host}:${port}/${identifier}?schema=public`
// }

export const getDbName = (stackName: string, stage: 'Dev' | 'Prod') =>
  `${stackName}${stage}Database`

export const getDbEnvironment = (
  database: DatabaseInstance,
  dbName: string,
) => {
  const { socketAddress, hostname, port } = database.instanceEndpoint
  return {
    DB_HOST: hostname,
    DB_PORT: port.toString(),
    DB_SOCKET_ADDRESS: socketAddress,
    DB_NAME: dbName,
  }
}

export const getDbSecrets = (secret?: ISecret) => {
  if (!secret) return undefined
  return {
    DB_USERNAME: ecs.Secret.fromSecretsManager(secret, 'username'),
    DB_PASSWORD: ecs.Secret.fromSecretsManager(secret, 'password'),
  }
}
