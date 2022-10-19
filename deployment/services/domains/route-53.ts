import {
  Certificate,
  CertificateValidation,
} from 'aws-cdk-lib/aws-certificatemanager'
import { HostedZone } from 'aws-cdk-lib/aws-route53'
import { Construct } from 'constructs'
import { Subdomain, SUB_DOMAINS } from '../../constants'
import { generateSslCertificate } from './certificate-manager'

export type DomainInfo = Record<
  Subdomain,
  {
    baseDomain: string
    zone: HostedZone
    domain: `${Subdomain}.${string}`
    certificate: Certificate
  }
>

export const getApiDomain = (scope: Construct, props: { domain: string }) => {
  const zone = new HostedZone(scope, 'HostedZone', {
    zoneName: props.domain,
  })

  const domainName = 'api.' + props.domain

  const certificate = new Certificate(scope, 'Cert', {
    domainName,
    validation: CertificateValidation.fromDns(),
  })

  return { certificate, domainName, zone }
}

export const getDomains = (scope: Construct, props: { domain: string }) => {
  const zone = new HostedZone(scope, 'HostedZone', {
    zoneName: props.domain,
  })

  const certificate = generateSslCertificate(scope, {
    domainName: props.domain,
    subDomains: SUB_DOMAINS,
  })

  const domainInfo = SUB_DOMAINS.reduce((domainInfo, curr) => {
    return {
      ...domainInfo,
      [curr]: {
        baseDomain: props.domain,
        zone: zone,
        domain: `${curr}.${props.domain}`,
        certificate: certificate,
      },
    }
  }, {} as DomainInfo)

  return { certificate, zone, domainInfo }
}
