#!/usr/bin/env node
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import {
  PlaybookPrimaryStack,
  PlaybookMemberStack,
  IControl
} from '../../../lib/sharrplaybook-construct';
import * as cdk_nag from 'cdk-nag';
import * as cdk from '@aws-cdk/core';
import 'source-map-support/register';

// SOLUTION_* - set by solution_env.sh
const SOLUTION_ID = process.env['SOLUTION_ID'] || 'undefined';
const SOLUTION_NAME = process.env['SOLUTION_NAME'] || 'undefined';
// DIST_* - set by build-s3-dist.sh
const DIST_VERSION = process.env['DIST_VERSION'] || '%%VERSION%%';
const DIST_OUTPUT_BUCKET = process.env['DIST_OUTPUT_BUCKET'] || '%%BUCKET%%';
const DIST_SOLUTION_NAME = process.env['DIST_SOLUTION_NAME'] || '%%SOLUTION%%';

const standardShortName = 'PCI';
const standardLongName = 'pci-dss';
const standardVersion = '3.2.1'; // DO NOT INCLUDE 'V'

const app = new cdk.App();
cdk.Aspects.of(app).add(new cdk_nag.AwsSolutionsChecks());

// Creates one rule per control Id. The Step Function determines what document to run based on
// Security Standard and Control Id. See cis-member-stack
const remediations: IControl[] = [
  { "control": "PCI.AutoScaling.1" },
  { "control": "PCI.IAM.7" },
  { "control": "PCI.CloudTrail.2" },
  { "control": "PCI.CodeBuild.2" },
  { "control": "PCI.CW.1" },
  { "control": "PCI.EC2.1" },
  { "control": "PCI.EC2.2" },
  { "control": "PCI.EC2.5" },
  { "control": "PCI.IAM.8" },
  { "control": "PCI.KMS.1" },
  { "control": "PCI.Lambda.1" },
  { "control": "PCI.RDS.1" },
  { "control": "PCI.RDS.2" },
  { "control": "PCI.Redshift.1" },
  { "control": "PCI.CloudTrail.1" },
  { "control": "PCI.EC2.6" },
  { "control": "PCI.CloudTrail.3" },
  { "control": "PCI.CloudTrail.4" },
  { "control": "PCI.Config.1" },
  { "control": "PCI.S3.1" },
  {
    "control": "PCI.S3.2",
    "executes": "PCI.S3.1"
  },
  { "control": "PCI.S3.4" },
  { "control": "PCI.S3.5" },
  { "control": "PCI.S3.6" }
];

const adminStack = new PlaybookPrimaryStack(app, 'PCI321Stack', {
  description: `(${SOLUTION_ID}P) ${SOLUTION_NAME} ${standardShortName} ${standardVersion} Compliance Pack - Admin Account, ${DIST_VERSION}`,
  solutionId: SOLUTION_ID,
  solutionVersion: DIST_VERSION,
  solutionDistBucket: DIST_OUTPUT_BUCKET,
  solutionDistName: DIST_SOLUTION_NAME,
  remediations: remediations,
  securityStandardLongName: standardLongName,
  securityStandard: standardShortName,
  securityStandardVersion: standardVersion
});

const memberStack = new PlaybookMemberStack(app, 'PCI321MemberStack', {
  description: `(${SOLUTION_ID}C) ${SOLUTION_NAME} ${standardShortName} ${standardVersion} Compliance Pack - Member Account, ${DIST_VERSION}`,
  solutionId: SOLUTION_ID,
  solutionVersion: DIST_VERSION,
  solutionDistBucket: DIST_OUTPUT_BUCKET,
  securityStandard: standardShortName,
  securityStandardVersion: standardVersion,
  securityStandardLongName: standardLongName,
  remediations: remediations
});

adminStack.templateOptions.templateFormatVersion = "2010-09-09";
memberStack.templateOptions.templateFormatVersion = "2010-09-09";
