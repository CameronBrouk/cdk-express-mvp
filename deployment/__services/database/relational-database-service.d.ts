import { Construct } from 'constructs';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as rds from 'aws-cdk-lib/aws-rds';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { ISecret } from 'aws-cdk-lib/aws-secretsmanager';
import { DatabaseInstance, DatabaseInstanceProps } from 'aws-cdk-lib/aws-rds';
import { InstanceTypeIdentifier } from '../../types/instance-types';
/**
  - Settings
    - instance:  t3.micro
    - type: postgres
  - Credentials: A Json string that resolves to:
    - "engine": "postgres",
    - "host": "<instance host name/resolvable DNS name>",
    - "username": "<username. if not specified, defaults to 'admin'",
    - "password": "<password. generated/rotated by aws secrets manager",
    - "dbname": "<database name. If not specified, defaults to 'postgres'>",
    - "port": "<TCP port number. If not specified, defaults to 5432>"
  - Cost
    - free tier:  $0/mo
    - after: $30(ish)/mo
  - Network Security
    - Only allows traffic from within VPC on Port 5432
  - Monitoring
    - both performanceInsights and enhancedMonitoring are set by default
    - "Performance Insights" checks the database load
        - docs: https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PerfInsights.html
    - "Enhanced Monitoring" checks CPU usage in the DB operating System
        - docs: https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_Monitoring.OS.html
 */
declare type subnetType = 'public' | 'private' | 'isolated';
declare type Props = {
    instanceType: InstanceTypeIdentifier;
    vpc: Vpc;
    databaseName: string;
    subnetType: subnetType;
    overrides?: DatabaseInstanceProps;
};
export declare const createDatabase: (scope: Construct, props: Props) => rds.DatabaseInstance;
declare type DBSecretFields = 'host' | 'port' | 'dbinstanceidentifier' | 'username' | 'password';
export declare const getDbSecretJson: (database: DatabaseInstance) => (field: DBSecretFields) => ecs.Secret;
export declare const getDbName: (stackName: string, stage: 'Dev' | 'Prod') => string;
export declare const getDbEnvironment: (database: DatabaseInstance, dbName: string) => {
    DB_HOST: string;
    DB_PORT: string;
    DB_SOCKET_ADDRESS: string;
    DB_NAME: string;
};
export declare const getDbSecrets: (secret?: ISecret) => {
    DB_USERNAME: ecs.Secret;
    DB_PASSWORD: ecs.Secret;
} | undefined;
export {};
