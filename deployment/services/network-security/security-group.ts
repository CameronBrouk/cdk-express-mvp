import * as ec2 from 'aws-cdk-lib/aws-ec2'
import { Peer, Port, SecurityGroup, Vpc } from 'aws-cdk-lib/aws-ec2'
import { Construct } from 'constructs'
import { DEVELOPERS } from '../../constants'

export type Ipv4Address = `${number}.${number}.${number}.${number}`
export type CidrBlock = `${Ipv4Address}/${number}`

type IpOrDev = Ipv4Address | keyof typeof DEVELOPERS

type ipv4Type = 'http' | 'https'
type InternetAllowance =
  | `allow-all-${ipv4Type}`
  | `allow-all-${ipv4Type}-in-vpc`
type Props = {
  identifier: string
  description: string
  vpc: Vpc
  internetAccess?:
    | {
        ssl?: boolean
        outbound: {} | InternetAllowance
        inbound: {} | InternetAllowance
      }
    | InternetAllowance
  sshAccess?:
    | {
        allowedIpAddresses?: Ipv4Address[]
        allowedDevelopers?: (keyof typeof DEVELOPERS)[]
      }
    | 'allow-all-developers'
}

export const createSecurityGroup = (scope: Construct, props: Props) => {
  const internetPort = getInternetPort(props)
  const portType = getInternetPortType(props)

  const securityGroup = new SecurityGroup(scope, props.identifier, {
    vpc: props.vpc,
    description: props.description,
    allowAllOutbound: false,
  })

  const allowAllRule = [
    Peer.anyIpv4(),
    Port.tcp(internetPort),
    `Allow ${portType} access from the public internet`,
  ] as const
  const allowAllVpcRule = [
    Peer.ipv4(props.vpc.vpcCidrBlock),
    Port.tcp(internetPort),
    `Allow ${portType} access from within this vpc`,
  ] as const

  if (typeof props.internetAccess === 'string') {
    if (
      props.internetAccess === 'allow-all-http' ||
      props.internetAccess === 'allow-all-https'
    ) {
      securityGroup.addEgressRule(...allowAllRule)
      securityGroup.addIngressRule(...allowAllRule)
    }

    if (
      props.internetAccess === 'allow-all-http-in-vpc' ||
      props.internetAccess === 'allow-all-https-in-vpc'
    ) {
      securityGroup.addEgressRule(...allowAllVpcRule)
      securityGroup.addIngressRule(...allowAllVpcRule)
    }
  }

  const { sshAccess } = props
  if (typeof sshAccess === 'string') {
    Object.values(DEVELOPERS).forEach((info) => {
      securityGroup.addIngressRule(
        Peer.ipv4(info.ipAddress + '/32'),
        Port.tcp(22),
        `Allow SSH access for an individual at network ${info.name}`,
      )
    })
  }
  if (typeof sshAccess === 'object') {
    sshAccess?.allowedIpAddresses?.forEach((ipAddress) => {
      securityGroup.addIngressRule(
        Peer.ipv4(ipAddress + '/32'),
        Port.tcp(22),
        `Allow SSH access for an individual at network ${ipAddress}`,
      )
    })
    sshAccess?.allowedDevelopers?.forEach((developer) => {
      const info = DEVELOPERS[developer]
      securityGroup.addIngressRule(
        Peer.ipv4(info.ipAddress + '/32'),
        Port.tcp(22),
        `Allow SSH access for an individual at network ${info.name}`,
      )
    })
  }

  return securityGroup
}

const getInternetPort = ({ internetAccess }: Props) => {
  if (typeof internetAccess === 'string') {
    return internetAccess.includes('https') ? 443 : 80
  }
  return internetAccess?.ssl ? 443 : 80
}
const getInternetPortType = ({ internetAccess }: Props) => {
  if (!internetAccess) return 'http'
  if (typeof internetAccess === 'string') return 'http'
  return internetAccess.ssl ? 'https' : 'http'
}
