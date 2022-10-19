import { Construct } from 'constructs';
declare type Props = {
    cdkIdentifier: string;
    logGroupName: string;
    prefix: string;
};
export declare const createLogDriver: (scope: Construct, props: Props) => import("aws-cdk-lib/aws-ecs").LogDriver;
export {};
