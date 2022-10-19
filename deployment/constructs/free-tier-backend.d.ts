import { Construct } from 'constructs';
declare type Props = {
    title: string;
    stage: 'Dev' | 'Prod';
};
export declare class FreeTierBackend extends Construct {
    constructor(scope: Construct, id: string, props: Props);
}
export {};
