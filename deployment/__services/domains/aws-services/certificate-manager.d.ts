import { Construct } from 'constructs';
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
declare type Props = {
    domainName: string;
    subDomains: readonly string[];
};
export declare const generateSslCertificate: (scope: Construct, props: Props) => Certificate;
export declare const createCertificate: (scope: Construct, props: Props) => Certificate;
export {};
