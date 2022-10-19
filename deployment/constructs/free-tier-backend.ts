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
} from '../__services/database/relational-database-service'
import { createDockerRepo } from '../__services/docker/aws-services/elastic-container-registry'
import { createTaskDefinition } from '../__services/docker/aws-services/task-definition'
import {
  createCertificate,
  generateSslCertificate,
} from '../_services/domains/certificate-manager'
import {
  getApiDomain,
  getDomains,
} from '../__services/domains/aws-services/route-53'
import { logCloudWatch } from '../_services/logging/cloudwatch'
import { createSecurityGroup } from '../__services/network-security/aws-services/security-group'
import { createVpc } from '../_services/network-security/virtual-private-cloud'
import { createRole } from '../__services/resource-permissions/aws-resources/identity-access-management'
import { createEcsService } from '../__services/server/aws-services/elastic-container-service/ecs-managed'

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
