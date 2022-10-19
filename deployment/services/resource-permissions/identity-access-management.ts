import * as iam from 'aws-cdk-lib/aws-iam'
import { Construct } from 'constructs'
import { ManagedPolicyString } from '../../types/managed-policy-string'
import { ServicePrincipalString } from '../../types/service-principal-string'

export const createRole = (
  scope: Construct,
  name: string,
  props: {
    forServices: ServicePrincipalString[]
    permissionsGranted: ManagedPolicyString[]
  },
) => {
  const servicesThatUseRole = props.forServices.map(
    (service) => new iam.ServicePrincipal(service),
  )

  const managedPolicies = props.permissionsGranted.map((policyName) =>
    iam.ManagedPolicy.fromAwsManagedPolicyName(policyName),
  )

  return new iam.Role(scope, name, {
    assumedBy: new iam.CompositePrincipal(...servicesThatUseRole),
    managedPolicies,
  })
}
