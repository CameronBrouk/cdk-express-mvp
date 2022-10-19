#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib'
import { FreeTierBackend } from './constructs/free-tier-backend'
import { UnimpairedStack } from './stacks/Unimpaired'

const app = new cdk.App()

new UnimpairedStack(app, 'Dev')
