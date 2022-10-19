import { Construct } from 'constructs'
import {
  Certificate,
  CertificateValidation,
} from 'aws-cdk-lib/aws-certificatemanager'

type Props = {
  domainName: string
  subDomains: readonly string[]
}
export const generateSslCertificate = (scope: Construct, props: Props) =>
  new Certificate(scope, 'SslCertificate', {
    domainName: props.domainName,
    subjectAlternativeNames: [
      ...props.subDomains.map(
        (subdomain) => `${subdomain}.${props.domainName}`,
      ),
    ],
    validation: CertificateValidation.fromDns(),
  })

export const createCertificate = (scope: Construct, props: Props) =>
  new Certificate(scope, 'SslCertificate', {
    domainName: props.domainName,
    subjectAlternativeNames: [
      'www',
      ...props.subDomains.map(
        (subdomain) => `${subdomain}.${props.domainName}`,
      ),
    ],
    validation: CertificateValidation.fromDns(),
  })
