import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import { HostedZone } from 'aws-cdk-lib/aws-route53';
import { Construct } from 'constructs';
import { Subdomain } from '../../../constants';
export declare type DomainInfo = Record<Subdomain, {
    baseDomain: string;
    zone: HostedZone;
    domain: `${Subdomain}.${string}`;
    certificate: Certificate;
}>;
export declare const getApiDomain: (scope: Construct, props: {
    domain: string;
}) => {
    certificate: Certificate;
    domainName: string;
    zone: HostedZone;
};
export declare const getDomains: (scope: Construct, props: {
    domain: string;
}) => {
    certificate: Certificate;
    zone: HostedZone;
    domainInfo: DomainInfo;
};
