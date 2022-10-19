import { Ipv4Address } from './services/network-security/security-group'
import { ManagedPolicyString } from './types/managed-policy-string'

type DeveloperMap = Record<
  string,
  {
    ipAddress: Ipv4Address
    name: string
    managedPolicies: ManagedPolicyString[]
  }
>
export const DEVELOPERS: DeveloperMap = {
  Cameron: {
    ipAddress: '97.85.239.10',
    name: 'Cameron Brouk',
    managedPolicies: [],
  },
}

export const GIT_COMMIT_HASH = 'latest-3'

export const GLOBAL_SSH_KEY_NAME = 'test-ec2-ssh'

export const SUB_DOMAINS = [
  'api',
  'user',
  'auth',
  'media',
  'www',
  'lambda',
] as const
export type Subdomain = typeof SUB_DOMAINS[number]
