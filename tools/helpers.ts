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
import prettier from 'prettier';
import { readdir, writeFile, readFile, stat } from 'fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
//@ts-ignore
import { prettier as prettierOpts } from '../package.json';
import {
  defaultOptions,
  ESLintConfiguration,
  ESLintConfigurationProperty,
  ESLintConfigurationSQProperty,
} from '../packages/jsts/src/rules/helpers/configs.js';
import assert from 'node:assert';

const ruleRegex = /^S\d+/;
export const DIRNAME = dirname(fileURLToPath(import.meta.url));
const REPOSITORY_ROOT = join(DIRNAME, '..');
export const TS_TEMPLATES_FOLDER = join(DIRNAME, 'templates', 'ts');
export const JAVA_TEMPLATES_FOLDER = join(DIRNAME, 'templates', 'java');
export const RULES_FOLDER = join(REPOSITORY_ROOT, 'packages', 'jsts', 'src', 'rules');
const JAVA_CHECKS_FOLDER = join(
  REPOSITORY_ROOT,
  'sonar-plugin',
  'javascript-checks',
  'src',
  'main',
  'java',
  'org',
  'sonar',
  'javascript',
  'checks',
);
export const METADATA_FOLDER = join(
  REPOSITORY_ROOT,
  'sonar-plugin',
  'javascript-checks',
  'src',
  'main',
  'resources',
  'org',
  'sonar',
  'l10n',
  'javascript',
  'rules',
  'javascript',
);
export const header = await readFile(join(DIRNAME, 'header.ts'), 'utf8');

const typeMatrix = {
  CODE_SMELL: 'suggestion',
  BUG: 'problem',
  SECURITY_HOTSPOT: 'problem',
  VULNERABILITY: 'problem',
} as const;

type rspecMeta = {
  type: keyof typeof typeMatrix;
  status: 'ready' | 'beta' | 'closed' | 'deprecated' | 'superseded';
  title: string;
  quickfix: 'covered' | undefined;
  tags: string[];
  scope: 'Main' | 'Tests' | 'All';
  compatibleLanguages: ('JAVASCRIPT' | 'TYPESCRIPT')[];
};

const sonarWayProfile = JSON.parse(
  await readFile(join(METADATA_FOLDER, `Sonar_way_profile.json`), 'utf-8'),
);

// Array sorter for Sonar rule IDs
const getInt = (sonarKey: string) => parseInt(/^S(\d+)/.exec(sonarKey)[1]);
const sonarKeySorter = (a: string, b: string) => getInt(a) - getInt(b);

export function verifyRuleName(eslintId: string) {
  const re = /^[a-z]+(-[a-z0-9]+)*$/;
  if (!re.exec(eslintId)) {
    throw new Error(`Invalid class name: it should match ${re}, but got "${eslintId}"`);
  }
}

export function verifyRspecId(sonarKey: string) {
  const re = /^S\d+$/;
  if (!re.exec(sonarKey)) {
    throw new Error(`Invalid rspec key: it should match ${re}, but got "${sonarKey}"`);
  }
}

/**
 * Inflate string template with given dictionary
 * @param text template string
 * @param dictionary object with the keys to replace
 */
export function inflateTemplate(text: string, dictionary: { [x: string]: string }): string {
  for (const key in dictionary) {
    text = text.replaceAll(key, dictionary[key]);
  }
  return text;
}

/**
 * Reads a template file, inflates it with the provided dictionary, and writes the prettified
 * result to destination file
 *
 * @param templatePath path to template file
 * @param dest destination file
 * @param dict dictionary to inflate the template
 */
export async function inflateTemplateToFile(
  templatePath: string,
  dest: string,
  dict: { [x: string]: string },
) {
  const template = await readFile(templatePath, 'utf8');
  await writePrettyFile(dest, inflateTemplate(template, dict));
}

export async function generateParsingErrorClass() {
  await inflateTemplateToFile(
    join(JAVA_TEMPLATES_FOLDER, 'parsingError.template'),
    join(JAVA_CHECKS_FOLDER, `S2260.java`),
    {
      ___HEADER___: header,
    },
  );
}

async function inflate1541() {
  await inflateTemplateToFile(
    join(JAVA_TEMPLATES_FOLDER, 'S1541.template'),
    join(JAVA_CHECKS_FOLDER, `S1541Ts.java`),
    {
      ___HEADER___: header,
      ___DECORATOR___: 'TypeScriptRule',
      ___CLASS_NAME___: 'S1541Ts',
      ___SQ_PROPERTY_NAME___: 'Threshold',
      ___SQ_PROPERTY_DESCRIPTION___: 'The maximum authorized complexity.',
    },
  );
  await inflateTemplateToFile(
    join(JAVA_TEMPLATES_FOLDER, 'S1541.template'),
    join(JAVA_CHECKS_FOLDER, `S1541Js.java`),
    {
      ___HEADER___: header,
      ___DECORATOR___: 'JavaScriptRule',
      ___CLASS_NAME___: 'S1541Js',
      ___SQ_PROPERTY_NAME___: 'maximumFunctionComplexityThreshold',
      ___SQ_PROPERTY_DESCRIPTION___: 'The maximum authorized complexity in function',
    },
  );
}

export async function generateJavaCheckClass(
  sonarKey: string,
  defaults: { compatibleLanguages?: ('JAVASCRIPT' | 'TYPESCRIPT')[]; scope?: 'Main' | 'Tests' },
) {
  if (sonarKey === 'S1541') {
    await inflate1541();
    return;
  }
  const ruleRspecMeta = await getRspecMeta(sonarKey, defaults);
  const imports: Set<string> = new Set();
  const decorators = [];
  let javaCheckClass: string;
  if (ruleRspecMeta.scope === 'Tests') {
    javaCheckClass = 'TestFileCheck';
    imports.add('import org.sonar.plugins.javascript.api.TestFileCheck;');
  } else {
    javaCheckClass = 'Check';
    imports.add('import org.sonar.plugins.javascript.api.Check;');
  }

  const derivedLanguages = ruleRspecMeta.compatibleLanguages;
  if (derivedLanguages.includes('JAVASCRIPT')) {
    decorators.push('@JavaScriptRule');
    imports.add('import org.sonar.plugins.javascript.api.JavaScriptRule;');
  }
  if (derivedLanguages.includes('TYPESCRIPT')) {
    decorators.push('@TypeScriptRule');
    imports.add('import org.sonar.plugins.javascript.api.TypeScriptRule;');
  }

  const eslintConfiguration = await getESLintDefaultConfiguration(sonarKey);
  const body = generateBody(eslintConfiguration, imports);

  await inflateTemplateToFile(
    join(JAVA_TEMPLATES_FOLDER, 'check.template'),
    join(JAVA_CHECKS_FOLDER, `${sonarKey}.java`),
    {
      ___HEADER___: header,
      ___DECORATORS___: decorators.join('\n'),
      ___RULE_KEY___: sonarKey,
      ___FILE_TYPE_CHECK___: javaCheckClass,
      ___IMPORTS___: [...imports].join('\n'),
      ___BODY___: body.join('\n'),
    },
  );
}

function isSonarSQProperty(
  property: ESLintConfigurationProperty,
): property is ESLintConfigurationSQProperty {
  return (property as ESLintConfigurationSQProperty).description !== undefined;
}

function generateBody(config: ESLintConfiguration, imports: Set<string>) {
  const result = [];
  let hasSQProperties = false;
  function generateRuleProperty(property: ESLintConfigurationProperty) {
    if (!isSonarSQProperty(property)) {
      return;
    }

    const getSQDefault = () => {
      return property.customDefault ?? property.default;
    };

    const getJavaType = () => {
      const defaultValue = getSQDefault();
      switch (typeof defaultValue) {
        case 'number':
          return 'int';
        case 'string':
          return 'String';
        case 'boolean':
          return 'boolean';
        default:
          return 'String';
      }
    };

    const getDefaultValueString = () => {
      const defaultValue = getSQDefault();
      switch (typeof defaultValue) {
        case 'number':
        case 'boolean':
          return `"" + ${defaultValue}`;
        case 'string':
          return `"${defaultValue}"`;
        case 'object': {
          assert(Array.isArray(defaultValue));
          return `"${defaultValue.join(',')}"`;
        }
      }
    };

    const getDefaultValue = () => {
      const defaultValue = getSQDefault();
      switch (typeof defaultValue) {
        case 'number':
        case 'boolean':
          return `${defaultValue.toString()}`;
        case 'string':
          return `"${defaultValue}"`;
        case 'object':
          assert(Array.isArray(defaultValue));
          return `"${defaultValue.join(',')}"`;
      }
    };

    const defaultFieldName = 'field' in property ? (property.field as string) : 'value';
    const defaultValue = getDefaultValueString();
    imports.add('import org.sonar.check.RuleProperty;');
    result.push(
      `@RuleProperty(key="${property.displayName ?? defaultFieldName}", description = "${property.description}", defaultValue = ${defaultValue})`,
    );
    result.push(`${getJavaType()} ${defaultFieldName} = ${getDefaultValue()};`);
    hasSQProperties = true;
    return defaultFieldName;
  }

  const configurations = [];
  config.forEach(config => {
    if (Array.isArray(config)) {
      const fields = config
        .map(namedProperty => {
          const fieldName = generateRuleProperty(namedProperty);
          if (!isSonarSQProperty(namedProperty) || !fieldName) {
            return undefined;
          }
          let value: string;
          if (typeof namedProperty.default === 'object') {
            const castTo = namedProperty.items.type === 'string' ? 'String' : 'Integer';
            imports.add('import java.util.Arrays;');
            value = `Arrays.stream(${fieldName}.split(",")).map(String::trim).toArray(${castTo}[]::new)`;
          } else if (namedProperty.customForConfiguration) {
            value = namedProperty.customForConfiguration;
          } else {
            value = fieldName;
          }
          return { fieldName, value };
        })
        .filter(field => field);
      if (fields.length > 0) {
        imports.add('import java.util.Map;');
        const mapContents = fields.map(({ fieldName, value }) => `"${fieldName}", ${value}`);
        configurations.push(`Map.of(${mapContents})`);
      }
    } else {
      let value = generateRuleProperty(config);
      if (isSonarSQProperty(config) && config.customForConfiguration) {
        value = config.customForConfiguration;
      }
      configurations.push(value);
    }
  });
  if (hasSQProperties) {
    imports.add('import java.util.List;');
    result.push(
      `@Override\npublic List<Object> configurations() {\n return List.of(${configurations.join(',')});\n}\n`,
    );
  }
  return result;
}

async function getESLintDefaultConfiguration(sonarKey: string): Promise<ESLintConfiguration> {
  const configFilePath = join(RULES_FOLDER, sonarKey, 'config.ts');
  const configFileExists = await exists(configFilePath);
  if (!configFileExists) {
    return [];
  }
  const config = await import(pathToFileURL(configFilePath).toString());
  return config.fields;
}

async function getRspecMeta(
  sonarKey: string,
  defaults: { compatibleLanguages?: ('JAVASCRIPT' | 'TYPESCRIPT')[]; scope?: 'Main' | 'Tests' },
): Promise<rspecMeta> {
  const rspecFile = join(METADATA_FOLDER, `${sonarKey}.json`);
  const rspecFileExists = await exists(rspecFile);
  if (!rspecFileExists) {
    console.log(`RSPEC metadata not found for rule ${sonarKey}.`);
  }
  return rspecFileExists
    ? JSON.parse(await readFile(rspecFile, 'utf-8'))
    : {
        // Dummy data to create compilable new rule metadata
        title: 'Description',
        tags: [],
        type: 'BUG',
        status: 'ready',
        ...defaults,
      };
}

/**
 * From the RSPEC json file, creates a generated-meta.ts file with ESLint formatted metadata
 *
 * @param sonarKey rule ID for which we need to create the generated-meta.ts file
 * @param defaults if rspec not found, extra properties to set. Useful for the new-rule script
 */
export async function generateMetaForRule(
  sonarKey: string,
  defaults: { compatibleLanguages?: ('JAVASCRIPT' | 'TYPESCRIPT')[]; scope?: 'Main' | 'Tests' },
) {
  const ruleRspecMeta = await getRspecMeta(sonarKey, defaults);
  if (!typeMatrix[ruleRspecMeta.type]) {
    console.log(`Type not found for rule ${sonarKey}`);
  }

  const ruleFolder = join(RULES_FOLDER, sonarKey);
  const eslintConfiguration = await getESLintDefaultConfiguration(sonarKey);

  await inflateTemplateToFile(
    join(TS_TEMPLATES_FOLDER, 'generated-meta.template'),
    join(ruleFolder, `generated-meta.ts`),
    {
      ___HEADER___: header,
      ___RULE_TYPE___: typeMatrix[ruleRspecMeta.type],
      ___RULE_KEY___: sonarKey,
      ___DESCRIPTION___: ruleRspecMeta.title.replace(/'/g, "\\'"),
      ___RECOMMENDED___: sonarWayProfile.ruleKeys.includes(sonarKey),
      ___TYPE_CHECKING___: `${ruleRspecMeta.tags.includes('type-dependent')}`,
      ___FIXABLE___: ruleRspecMeta.quickfix === 'covered' ? "'code'" : undefined,
      ___DEPRECATED___: `${ruleRspecMeta.status === 'deprecated'}`,
      ___DEFAULT_OPTIONS___: JSON.stringify(defaultOptions(eslintConfiguration), null, 2),
      ___LANGUAGES___: JSON.stringify(ruleRspecMeta.compatibleLanguages),
      ___SCOPE___: ruleRspecMeta.scope,
    },
  );
}

/**
 * Get path to Java source
 *
 * @param target whether get source path to "main" or "test" files
 */
export function javaChecksPath(target: 'main' | 'test') {
  return join(
    DIRNAME,
    '../',
    'sonar-plugin',
    'javascript-checks',
    'src',
    target,
    'java',
    'org',
    'sonar',
    'javascript',
    'checks',
  );
}

/**
 * List all Java checks classes
 */
export async function getAllJavaChecks() {
  const files = await readdir(javaChecksPath('main'), { withFileTypes: true });
  return files
    .filter(file => ruleRegex.test(file.name) && !file.isDirectory())
    .map(file => file.name.slice(0, -5)) // remove .java extension
    .sort(sonarKeySorter);
}

/**
 * Get the metadata for all rules in SonarJS
 */
export async function getAllRulesMetadata() {
  const rulesMetadata = [];
  for (const file of await listRulesDir()) {
    rulesMetadata.push(await import(pathToFileURL(join(RULES_FOLDER, file, 'meta.js')).toString()));
  }
  return rulesMetadata;
}

/**
 * List all rules in SonarJS
 */
export async function listRulesDir() {
  const files = await readdir(RULES_FOLDER, { withFileTypes: true });
  return files
    .filter(file => ruleRegex.test(file.name) && file.isDirectory())
    .map(file => file.name)
    .sort(sonarKeySorter);
}

async function exists(file: string) {
  return stat(file)
    .then(() => true)
    .catch(() => false);
}

export async function writePrettyFile(filepath: string, contents: string) {
  await writeFile(
    filepath,
    await prettier.format(contents, {
      ...(prettierOpts as prettier.Options),
      filepath,
      plugins: ['prettier-plugin-java'],
    }),
  );
}
