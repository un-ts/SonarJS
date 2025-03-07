/*
 * SonarQube JavaScript Plugin
 * Copyright (C) 2011-2025 SonarSource SA
 * mailto:info AT sonarsource DOT com
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the Sonar Source-Available License Version 1, as published by SonarSource SA.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the Sonar Source-Available License for more details.
 *
 * You should have received a copy of the Sonar Source-Available License
 * along with this program; if not, see https://sonarsource.com/license/ssal/
 */
import { join, basename, dirname } from 'node:path/posix';
import fs from 'node:fs/promises';
import { writeResults } from './lits.js';
import { analyzeHTML } from '../../../html/src/index.js';
import { isHtmlFile, isJsTsFile, isYamlFile } from './languages.js';
import { analyzeYAML } from '../../../yaml/src/index.js';
import projects from '../data/projects.json' with { type: 'json' };
import { Linter } from '../../../jsts/src/linter/linter.js';
import {
  DEFAULT_EXCLUSIONS,
  JsTsFiles,
  ProjectAnalysisOutput,
} from '../../../jsts/src/analysis/projectAnalysis/projectAnalysis.js';
import { analyzeProject } from '../../../jsts/src/analysis/projectAnalysis/projectAnalyzer.js';
import { accept } from '../../../jsts/src/analysis/projectAnalysis/filter/filter.js';
import { toUnixPath } from '../../../shared/src/helpers/files.js';
import { AnalysisInput, AnalysisOutput } from '../../../shared/src/types/analysis.js';
import { createParsingIssue, parseParsingError } from '../../../bridge/src/errors/index.js';
import { compare, Result } from 'dir-compare';
import { RuleConfig } from '../../../jsts/src/linter/config/rule-config.js';
import { expect } from 'expect';
import * as metas from '../../../jsts/src/rules/metas.js';
import { SonarMeta } from '../../../jsts/src/rules/index.js';
import { defaultOptions } from '../../../jsts/src/rules/helpers/configs.js';
import { findFiles } from '../../../shared/src/helpers/find-files.js';

const currentPath = toUnixPath(import.meta.dirname);

const sourcesPath = join(currentPath, '..', '..', '..', '..', '..', 'sonarjs-ruling-sources');
const jsTsProjectsPath = join(sourcesPath, 'jsts', 'projects');
const expectedPathBase = join(
  currentPath,
  '..',
  '..',
  '..',
  '..',
  'its',
  'ruling',
  'src',
  'test',
  'expected',
  'jsts',
);
const actualPathBase = join(currentPath, '..', 'actual', 'jsts');

const SETTINGS_KEY = 'SONAR_RULING_SETTINGS';

type ProjectsData = {
  name: string;
  folder: string;
  testDir: string;
  exclusions: string;
};

export function projectName(projectFile: string) {
  const filename = basename(toUnixPath(projectFile));
  return filename.substring(0, filename.length - '.ruling.test.ts'.length);
}

export async function testProject(projectName: string) {
  const settingsPath = process.env[SETTINGS_KEY];
  let params: {
    rules?: RuleConfig[];
    expectedPath?: string;
    actualPath?: string;
  } = {};
  if (settingsPath) {
    params = require(settingsPath);
  }

  const { folder, name, exclusions, testDir } = (projects as ProjectsData[]).find(
    p => p.name === projectName,
  );
  const rules = Object.entries(metas)
    .flatMap(([key, meta]: [string, SonarMeta]): RuleConfig[] => {
      return meta.languages.map(language => ({
        key,
        configurations: defaultOptions(meta.fields) || [],
        language: language === 'JAVASCRIPT' ? 'js' : 'ts',
        fileTypeTargets: meta.scope === 'Tests' ? ['TEST'] : ['MAIN'],
        analysisModes: ['DEFAULT'],
      }));
    })
    .map(applyRulingConfig);
  const expectedPath = join(params?.expectedPath ?? expectedPathBase, name);
  const actualPath = join(params?.actualPath ?? actualPathBase, name);

  const projectPath = join(jsTsProjectsPath, folder ?? name);
  const testPath = testDir ? join(projectPath, testDir) : null;

  const jsTsFiles = {},
    htmlFiles = {},
    yamlFiles = {};
  await findFiles(
    projectPath,
    async file => {
      const filePath = toUnixPath(join(file.parentPath, file.name));
      const fileType = testPath && dirname(filePath).startsWith(testPath) ? 'TEST' : 'MAIN';
      if (isHtmlFile(filePath)) {
        htmlFiles[filePath] = { fileType, filePath };
      } else if (isYamlFile(filePath)) {
        yamlFiles[filePath] = { fileType, filePath };
      } else if (isJsTsFile(filePath)) {
        const fileContent = await fs.readFile(filePath, 'utf8');
        if (accept(filePath, fileContent)) {
          jsTsFiles[filePath] = { fileType, filePath, fileContent };
        }
      }
    },
    DEFAULT_EXCLUSIONS.concat((exclusions || '').split(',')),
  );

  const results = await analyzeProject({
    rules,
    baseDir: projectPath,
    files: jsTsFiles,
  });
  await analyzeFiles(yamlFiles, analyzeYAML, results);

  /* we disable `no-var` for HTML */
  Linter.rulesConfig.forEach(rules => {
    rules['sonarjs/S3504'] = ['off'];
  });
  await analyzeFiles(htmlFiles, analyzeHTML, results);

  await writeResults(projectPath, name, results, actualPath);

  return await compare(expectedPath, actualPath, { compareContent: true });
}

export function ok(diff: Result) {
  expect(
    JSON.stringify(
      diff.diffSet.filter(value => value.state !== 'equal'),
      null,
      2,
    ),
  ).toEqual('[]');
}

/**
 * Analyze files the old school way.
 * Used for HTML and YAML
 */
async function analyzeFiles(
  files: JsTsFiles,
  analyzer: (payload: AnalysisInput) => Promise<AnalysisOutput>,
  results: ProjectAnalysisOutput,
) {
  for (const [filePath, fileData] of Object.entries(files)) {
    try {
      results.files[filePath] = await analyzer(fileData);
    } catch (err) {
      results.files[filePath] = createParsingIssue(parseParsingError(err));
    }
  }
}

/**
 * Apply the non-default configuration for some rules
 */
function applyRulingConfig(rule: RuleConfig) {
  switch (rule.key) {
    case 'S2486': {
      // for some reason the scope is different
      rule.fileTypeTargets = ['TEST'];
      break;
    }
    case 'S1451': {
      if (rule.language === 'js') {
        rule.configurations[0].headerFormat =
          '// Copyright 20\\d\\d The Closure Library Authors. All Rights Reserved.';
        rule.configurations[0].isRegularExpression = true;
      } else {
        rule.configurations[0].headerFormat = '//.*';
        rule.configurations[0].isRegularExpression = true;
      }
      break;
    }
    case 'S124': {
      rule.configurations[0].regularExpression = '.*TODO.*';
      rule.configurations[0].flags = 'i';
      break;
    }
    case 'S1192': {
      if (rule.language === 'js') {
        rule.configurations[0]!.threshold = 4;
      }
      break;
    }
  }
  return rule;
}
