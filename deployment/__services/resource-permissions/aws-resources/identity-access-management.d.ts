import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import { ManagedPolicyString } from '../../../types/managed-policy-string';
import { ServicePrincipalString } from '../../../types/service-principal-string';
export declare const createRole: (scope: Construct, name: string, props: {
    forServices: ServicePrincipalString[];
    permissionsGranted: ManagedPolicyString[];
}) => iam.Role;
