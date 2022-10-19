import { LaunchTemplate, LaunchTemplateProps, SecurityGroup, Vpc } from 'aws-cdk-lib/aws-ec2';
import { Role } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import { InstanceTypeIdentifier } from '../../../types/instance-types';
declare type Props = {
    vpc: Vpc;
    /**
     * If you are using this launch template with ECS, you must include the cluster name.
     * If you don't include this name, your shit won't work. You can get the name by calling:
     @example
     const cluster = new Cluster()
     *clusterName = cluster.clusterName
     */
    ecsClusterName?: string;
    /**
     * The same security group that is defined for your ECS Services
     */
    ecsSecurityGroup: SecurityGroup;
    /**
     * Regardless of this instances purpose, you will probably need to add
     * some permissions to access other AWS resources.
     */
    role: Role;
    instanceType: InstanceTypeIdentifier;
    /**
     * If you want to run some shell commands when the container first instantiates
     * you can do so with a shell script. The path given must begin at the directory that contains cdk.json file
     */
    startupShellScriptPath: string;
    overrides?: LaunchTemplateProps;
};
export declare const createLaunchTemplate: (scope: Construct, props: Props) => LaunchTemplate;
export {};
