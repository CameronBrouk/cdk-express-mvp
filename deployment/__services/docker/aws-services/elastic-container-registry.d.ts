import { Repository } from 'aws-cdk-lib/aws-ecr';
import { Construct } from 'constructs';
declare type Props = {
    repoName: string;
};
export declare const createDockerRepo: (scope: Construct, props: Props) => Repository;
export {};
