import { ContainerImage } from 'aws-cdk-lib/aws-ecs'
import { CdkCommand } from 'aws-cdk-lib/cloud-assembly-schema'
import { Construct } from 'constructs'
import { GIT_COMMIT_HASH } from '../constants'
import {
  createDatabase,
  getDbEnvironment,
  getDbName,
  getDbSecretJson,
  getDbSecrets,
} from '../services/database/relational-database-service'
import { createDockerRepo } from '../services/docker/elastic-container-registry'
import { createTaskDefinition } from '../services/docker/task-definition'
import {
  createCertificate,
  generateSslCertificate,
} from '../services/domains/certificate-manager'
import { getDomains } from '../services/domains/route-53'
import { logCloudWatch } from '../services/logging/cloudwatch'
import { createVpc } from '../services/network-security/virtual-private-cloud'
import { createEcsService } from '../services/server/ecs-managed'

type Props = {
  title: string
  stage: 'Dev' | 'Prod'
}

export class FreeTierBackend extends Construct {
  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id)

    const vpc = createVpc(this, {
      identifier: 'Vpc',
      freeTier: true,
    })

    const databaseName = getDbName(props.title, props.stage)
    const database = createDatabase(this, {
      vpc,
      databaseName,
      instanceType: 't3.micro',
      subnetType: 'public',
    })

    const repo = createDockerRepo(this, { repoName: 'swing-repo' })
    const image = ContainerImage.fromEcrRepository(repo, GIT_COMMIT_HASH)

    const taskDefinition = createTaskDefinition(this, {
      secrets: getDbSecrets(database.secret),
      environment: getDbEnvironment(database, databaseName),
      image,
    })

    const { domainInfo } = getDomains(this, {
      domain: 'cameronbrouk.com',
    })

    const service = createEcsService(this, {
      instanceType: 't3.micro',
      taskDefinition,
      vpc,
      domainInfo: domainInfo['api'],
    })

    database.connections.allowDefaultPortFrom(service.service)

    logCloudWatch(this, 'api-url', service.loadBalancer.loadBalancerDnsName)
    logCloudWatch(this, 'RepoName', repo.repositoryName)
    logCloudWatch(this, 'ImageName', image.imageName)
  }
}
