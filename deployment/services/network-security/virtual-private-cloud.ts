import { InstanceType, SubnetType, Vpc, VpcProps } from 'aws-cdk-lib/aws-ec2'
import { Construct } from 'constructs'
import { FckNatInstanceProvider } from 'cdk-fck-nat'

type Props = {
  identifier: string
  /**
   * Indicates that there should only be a single, public subnet in this VPC
   * If you want it to be free, this must be true. Otherwise, your shit in private subnets won't be able
   * to talk to each other without a NAT gateway or VPC endpoints.
   * Both of those things cost money(even for free tier accounts).
   * NOTE:  Security Groups allow you to limit access to your resources.
   * because you are not utilizing subnets, you *must* configure them adequately.
   * @default true
   */
  freeTier?: boolean

  /**
    Normal CDK props for configuring a VPC
    @default undefined
  */
  overrides?: VpcProps
}

export const createVpc = (scope: Construct, props: Props) => {
  const { freeTier = true } = props
  if (freeTier) {
    return new Vpc(scope, props.identifier, {
      maxAzs: 2, // In order for RDS to work correctly, we need a minimum of 2 AZ's
      natGateways: 0,
      subnetConfiguration: [publicSubnet],
      ...props.overrides,
    })
  }

  return new Vpc(scope, props.identifier, {
    // fckNat saves a ton of money.
    // see: https://github.com/AndrewGuenther/fck-nat
    natGatewayProvider: new FckNatInstanceProvider({
      instanceType: new InstanceType('t4g.nano'),
    }),
    // By default, we don't get an isolated subnet.
    // in most instances, we probably want one(for RDS).
    // In certain instances, we can avoid NAT gateways by utilizing
    // an isolated subnet
    subnetConfiguration: [publicSubnet, privateSubnet, isolatedSubnet],
  })
}

const publicSubnet = {
  subnetType: SubnetType.PUBLIC,
  name: 'Public',
  cidrMask: 24,
}
const privateSubnet = {
  subnetType: SubnetType.PRIVATE_WITH_EGRESS,
  name: 'Private',
  cidrMask: 24,
}
const isolatedSubnet = {
  cidrMask: 28,
  name: 'Isolated',
  subnetType: SubnetType.PRIVATE_ISOLATED,
}
