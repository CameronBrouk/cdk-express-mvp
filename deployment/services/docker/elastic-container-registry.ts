import { Repository, TagMutability } from 'aws-cdk-lib/aws-ecr'
import { Construct } from 'constructs'

type Props = {
  repoName: string
}

export const createDockerRepo = (scope: Construct, props: Props) => {
  const repo = new Repository(scope, `Repo`, {
    repositoryName: props.repoName,
    imageTagMutability: TagMutability.MUTABLE, // In case we fuck up, don't replace shit
    lifecycleRules: [
      {
        maxImageCount: 2,
        description: 'Only keep 2 images to stay under 500MB of ECR storage',
      },
    ],
  })

  return repo
}
