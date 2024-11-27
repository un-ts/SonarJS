/*
 * SonarQube JavaScript Plugin
 * Copyright (C) 2011-2024 SonarSource SA
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
/**
 * This is the entry point of the ESLint Plugin.
 * Said differently, this is the public API of the ESLint Plugin.
 */
import type { Linter, Rule } from 'eslint';

import * as originalRules from './original.js';
import * as decoratedRules from './decorated.js';

export const rules: Record<string, Rule.RuleModule> = {
  'anchor-precedence': originalRules.S5850,
  'argument-type': originalRules.S3782,
  'arguments-order': originalRules.S2234,
  'arguments-usage': originalRules.S3513,
  'array-callback-without-return': originalRules.S3796,
  'array-constructor': originalRules.S1528,
  'arrow-function-convention': originalRules.S3524,
  'assertions-in-tests': originalRules.S2699,
  'aws-apigateway-public-api': originalRules.S6333,
  'aws-ec2-rds-dms-public': originalRules.S6329,
  'aws-ec2-unencrypted-ebs-volume': originalRules.S6275,
  'aws-efs-unencrypted': originalRules.S6332,
  'aws-iam-all-privileges': originalRules.S6302,
  'aws-iam-all-resources-accessible': originalRules.S6304,
  'aws-iam-privilege-escalation': originalRules.S6317,
  'aws-iam-public-access': originalRules.S6270,
  'aws-opensearchservice-domain': originalRules.S6308,
  'aws-rds-unencrypted-databases': originalRules.S6303,
  'aws-restricted-ip-admin-access': originalRules.S6321,
  'aws-s3-bucket-granted-access': originalRules.S6265,
  'aws-s3-bucket-insecure-http': originalRules.S6249,
  'aws-s3-bucket-public-access': originalRules.S6281,
  'aws-s3-bucket-server-encryption': originalRules.S6245,
  'aws-s3-bucket-versioning': originalRules.S6252,
  'aws-sagemaker-unencrypted-notebook': originalRules.S6319,
  'aws-sns-unencrypted-topics': originalRules.S6327,
  'aws-sqs-unencrypted-queue': originalRules.S6330,
  'bitwise-operators': originalRules.S1529,
  'bool-param-default': originalRules.S4798,
  'call-argument-line': originalRules.S1472,
  'certificate-transparency': originalRules.S5742,
  'chai-determinate-assertion': originalRules.S6092,
  'class-name': originalRules.S101,
  'class-prototype': originalRules.S3525,
  'code-eval': originalRules.S1523,
  'cognitive-complexity': originalRules.S3776,
  'comma-or-logical-or-case': originalRules.S3616,
  'comment-regex': originalRules.S124,
  'concise-regex': originalRules.S6353,
  'conditional-indentation': originalRules.S3973,
  'confidential-information-logging': originalRules.S5757,
  'constructor-for-side-effects': originalRules.S1848,
  'content-length': originalRules.S5693,
  'content-security-policy': originalRules.S5728,
  'cookie-no-httponly': originalRules.S3330,
  cookies: originalRules.S2255,
  cors: originalRules.S5122,
  csrf: originalRules.S4502,
  'cyclomatic-complexity': originalRules.S1541,
  'declarations-in-global-scope': originalRules.S3798,
  deprecation: originalRules.S1874,
  'destructuring-assignment-syntax': originalRules.S3514,
  'different-types-comparison': originalRules.S3403,
  'disabled-auto-escaping': originalRules.S5247,
  'disabled-resource-integrity': originalRules.S5725,
  'disabled-timeout': originalRules.S6080,
  'dns-prefetching': originalRules.S5743,
  'duplicates-in-character-class': originalRules.S5869,
  'elseif-without-else': originalRules.S126,
  'empty-string-repetition': originalRules.S5842,
  encryption: originalRules.S4787,
  'encryption-secure-mode': originalRules.S5542,
  'enforce-trailing-comma': originalRules.S3723,
  'existing-groups': originalRules.S6328,
  'expression-complexity': originalRules.S1067,
  'file-header': originalRules.S1451,
  'file-name-differ-from-class': originalRules.S3317,
  'file-permissions': originalRules.S2612,
  'file-uploads': originalRules.S2598,
  'fixme-tag': originalRules.S1134,
  'for-in': originalRules.S1535,
  'for-loop-increment-sign': originalRules.S2251,
  'frame-ancestors': originalRules.S5732,
  'function-inside-loop': originalRules.S1515,
  'function-name': originalRules.S100,
  'function-return-type': originalRules.S3800,
  'future-reserved-words': originalRules.S1527,
  'generator-without-yield': originalRules.S3531,
  hashing: originalRules.S4790,
  'hidden-files': originalRules.S5691,
  'hook-use-state': originalRules.S6754,
  'in-operator-type-error': originalRules.S3785,
  'inconsistent-function-call': originalRules.S3686,
  'index-of-compare-to-positive-number': originalRules.S2692,
  'insecure-cookie': originalRules.S2092,
  'insecure-jwt-token': originalRules.S5659,
  'inverted-assertion-arguments': originalRules.S3415,
  'jsx-key': originalRules.S6477,
  'jsx-no-constructed-context-values': originalRules.S6481,
  'label-position': originalRules.S1439,
  'link-with-target-blank': originalRules.S5148,
  'max-switch-cases': originalRules.S1479,
  'max-union-size': originalRules.S4622,
  'misplaced-loop-counter': originalRules.S1994,
  'mouse-events-a11y': originalRules.S1082,
  'nested-control-flow': originalRules.S134,
  'new-operator-misuse': originalRules.S2999,
  'no-all-duplicated-branches': originalRules.S3923,
  'no-alphabetical-sort': originalRules.S2871,
  'no-angular-bypass-sanitization': originalRules.S6268,
  'no-array-delete': originalRules.S2870,
  'no-array-index-key': originalRules.S6479,
  'no-associative-arrays': originalRules.S3579,
  'no-async-constructor': originalRules.S7059,
  'no-built-in-override': originalRules.S2424,
  'no-case-label-in-switch': originalRules.S1219,
  'no-clear-text-protocols': originalRules.S5332,
  'no-code-after-done': originalRules.S6079,
  'no-collapsible-if': originalRules.S1066,
  'no-collection-size-mischeck': originalRules.S3981,
  'no-commented-code': originalRules.S125,
  'no-dead-store': originalRules.S1854,
  'no-delete-var': originalRules.S3001,
  'no-deprecated-react': originalRules.S6957,
  'no-duplicate-in-composite': originalRules.S4621,
  'no-duplicate-string': originalRules.S1192,
  'no-duplicated-branches': originalRules.S1871,
  'no-element-overwrite': originalRules.S4143,
  'no-empty-after-reluctant': originalRules.S6019,
  'no-empty-alternatives': originalRules.S6323,
  'no-empty-collection': originalRules.S4158,
  'no-empty-group': originalRules.S6331,
  'no-empty-test-file': originalRules.S2187,
  'no-equals-in-for-termination': originalRules.S888,
  'no-exclusive-tests': originalRules.S6426,
  'no-extra-arguments': originalRules.S930,
  'no-for-in-iterable': originalRules.S4139,
  'no-function-declaration-in-block': originalRules.S1530,
  'no-global-this': originalRules.S2990,
  'no-globals-shadowing': originalRules.S2137,
  'no-gratuitous-expressions': originalRules.S2589,
  'no-hardcoded-ip': originalRules.S1313,
  'no-hardcoded-passwords': originalRules.S2068,
  'no-hardcoded-secrets': originalRules.S6418,
  'no-hook-setter-in-body': originalRules.S6442,
  'no-identical-conditions': originalRules.S1862,
  'no-identical-expressions': originalRules.S1764,
  'no-identical-functions': originalRules.S4144,
  'no-ignored-exceptions': originalRules.S2486,
  'no-ignored-return': originalRules.S2201,
  'no-implicit-dependencies': originalRules.S4328,
  'no-implicit-global': originalRules.S2703,
  'no-in-misuse': originalRules.S4619,
  'no-incomplete-assertions': originalRules.S2970,
  'no-inconsistent-returns': originalRules.S3801,
  'no-incorrect-string-concat': originalRules.S3402,
  'no-internal-api-use': originalRules.S6627,
  'no-intrusive-permissions': originalRules.S5604,
  'no-invalid-await': originalRules.S4123,
  'no-invariant-returns': originalRules.S3516,
  'no-inverted-boolean-check': originalRules.S1940,
  'no-ip-forward': originalRules.S5759,
  'no-labels': originalRules.S1119,
  'no-literal-call': originalRules.S6958,
  'no-mime-sniff': originalRules.S5734,
  'no-misleading-array-reverse': originalRules.S4043,
  'no-mixed-content': originalRules.S5730,
  'no-nested-assignment': originalRules.S1121,
  'no-nested-conditional': originalRules.S3358,
  'no-nested-functions': originalRules.S2004,
  'no-nested-incdec': originalRules.S881,
  'no-nested-switch': originalRules.S1821,
  'no-nested-template-literals': originalRules.S4624,
  'no-one-iteration-loop': originalRules.S1751,
  'no-os-command-from-path': originalRules.S4036,
  'no-parameter-reassignment': originalRules.S1226,
  'no-primitive-wrappers': originalRules.S1533,
  'no-redundant-assignments': originalRules.S4165,
  'no-redundant-boolean': originalRules.S1125,
  'no-redundant-jump': originalRules.S3626,
  'no-redundant-optional': originalRules.S4782,
  'no-redundant-parentheses': originalRules.S1110,
  'no-reference-error': originalRules.S3827,
  'no-referrer-policy': originalRules.S5736,
  'no-require-or-define': originalRules.S3533,
  'no-return-type-any': originalRules.S4324,
  'no-same-argument-assert': originalRules.S5863,
  'no-same-line-conditional': originalRules.S3972,
  'no-selector-parameter': originalRules.S2301,
  'no-skipped-test': originalRules.S1607,
  'no-sonar-comments': originalRules.S1291,
  'no-small-switch': originalRules.S1301,
  'no-tab': originalRules.S105,
  'no-table-as-layout': originalRules.S5257,
  'no-try-promise': originalRules.S4822,
  'no-undefined-argument': originalRules.S4623,
  'no-undefined-assignment': originalRules.S2138,
  'no-unenclosed-multiline-block': originalRules.S2681,
  'no-uniq-key': originalRules.S6486,
  'no-unsafe': originalRules.S6791,
  'no-unsafe-unzip': originalRules.S5042,
  'no-unstable-nested-components': originalRules.S6478,
  'no-unthrown-error': originalRules.S3984,
  'no-unused-collection': originalRules.S4030,
  'no-unused-function-argument': originalRules.S1172,
  'no-use-of-empty-return-value': originalRules.S3699,
  'no-useless-catch': originalRules.S2737,
  'no-useless-increment': originalRules.S2123,
  'no-useless-intersection': originalRules.S4335,
  'no-useless-react-setstate': originalRules.S6443,
  'no-variable-usage-before-declaration': originalRules.S1526,
  'no-vue-bypass-sanitization': originalRules.S6299,
  'no-weak-cipher': originalRules.S5547,
  'no-weak-keys': originalRules.S4426,
  'no-wildcard-import': originalRules.S2208,
  'non-existent-operator': originalRules.S2757,
  'non-number-in-arithmetic-expression': originalRules.S3760,
  'null-dereference': originalRules.S2259,
  'object-alt-content': originalRules.S5264,
  'operation-returning-nan': originalRules.S3757,
  'os-command': originalRules.S4721,
  'post-message': originalRules.S2819,
  'prefer-default-last': originalRules.S4524,
  'prefer-immediate-return': originalRules.S1488,
  'prefer-object-literal': originalRules.S2428,
  'prefer-promise-shorthand': originalRules.S4634,
  'prefer-single-boolean-return': originalRules.S1126,
  'prefer-type-guard': originalRules.S4322,
  'prefer-while': originalRules.S1264,
  'process-argv': originalRules.S4823,
  'production-debug': originalRules.S4507,
  'pseudo-random': originalRules.S2245,
  'public-static-readonly': originalRules.S1444,
  'publicly-writable-directories': originalRules.S5443,
  'reduce-initial-value': originalRules.S6959,
  'redundant-type-aliases': originalRules.S6564,
  'regex-complexity': originalRules.S5843,
  'regular-expr': originalRules.S4784,
  'session-regeneration': originalRules.S5876,
  'shorthand-property-grouping': originalRules.S3499,
  'single-char-in-character-classes': originalRules.S6397,
  'single-character-alternation': originalRules.S6035,
  'slow-regex': originalRules.S5852,
  sockets: originalRules.S4818,
  'sonar-block-scoped-var': originalRules.S2392,
  'sonar-jsx-no-leaked-render': originalRules.S6439,
  'sonar-max-lines': originalRules.S104,
  'sonar-max-lines-per-function': originalRules.S138,
  'sonar-no-control-regex': originalRules.S6324,
  'sonar-no-empty-character-class': originalRules.S2639,
  'sonar-no-fallthrough': originalRules.S128,
  'sonar-no-invalid-regexp': originalRules.S5856,
  'sonar-no-magic-numbers': originalRules.S109,
  'sonar-no-misleading-character-class': originalRules.S5868,
  'sonar-no-regex-spaces': originalRules.S6326,
  'sonar-no-unused-class-component-methods': originalRules.S6441,
  'sonar-no-unused-vars': originalRules.S1481,
  'sonar-prefer-optional-chain': originalRules.S6582,
  'sonar-prefer-read-only-props': originalRules.S6759,
  'sonar-prefer-regexp-exec': originalRules.S6594,
  'sql-queries': originalRules.S2077,
  'stable-tests': originalRules.S5973,
  'standard-input': originalRules.S4829,
  'stateful-regex': originalRules.S6351,
  'strict-transport-security': originalRules.S5739,
  'strings-comparison': originalRules.S3003,
  'super-invocation': originalRules.S3854,
  'table-header': originalRules.S5256,
  'table-header-reference': originalRules.S5260,
  'test-check-exception': originalRules.S5958,
  'todo-tag': originalRules.S1135,
  'too-many-break-or-continue-in-loop': originalRules.S135,
  'unicode-aware-regex': originalRules.S5867,
  'unused-import': originalRules.S1128,
  'unused-named-groups': originalRules.S5860,
  'unverified-certificate': originalRules.S4830,
  'unverified-hostname': originalRules.S5527,
  'updated-const-var': originalRules.S3500,
  'updated-loop-counter': originalRules.S2310,
  'use-type-alias': originalRules.S4323,
  'useless-string-operation': originalRules.S1154,
  'values-not-convertible-to-numbers': originalRules.S3758,
  'variable-name': originalRules.S117,
  'void-use': originalRules.S3735,
  'weak-ssl': originalRules.S4423,
  'web-sql-database': originalRules.S2817,
  'x-powered-by': originalRules.S5689,
  'xml-parser-xxe': originalRules.S2755,
  xpath: originalRules.S4817,

  'sonar-max-params': decoratedRules.S107,
  'no-unused-private-class-members': decoratedRules.S1068,
  'alt-text': decoratedRules.S1077,
  'brace-style': decoratedRules.S1105,
  'no-extra-semi': decoratedRules.S1116,
  'no-empty-function': decoratedRules.S1186,
  'switch-without-default': decoratedRules.S131,
  semi: decoratedRules.S1438,
  'sonar-no-dupe-keys': decoratedRules.S1534,
  'no-unreachable': decoratedRules.S1763,
  'default-param-last': decoratedRules.S1788,
  'no-infinite-loop': decoratedRules.S2189,
  'accessor-pairs': decoratedRules.S2376,
  'new-cap': decoratedRules.S2430,
  'use-isnan': decoratedRules.S2688,
  'no-redeclare': decoratedRules.S2814,
  'object-shorthand': decoratedRules.S3498,
  'no-var': decoratedRules.S3504,
  'prefer-template': decoratedRules.S3512,
  'no-throw-literal': decoratedRules.S3696,
  'no-empty-interface': decoratedRules.S4023,
  'media-has-caption': decoratedRules.S4084,
  'prefer-for-of': decoratedRules.S4138,
  'prefer-namespace-keyword': decoratedRules.S4156,
  'no-accessor-field-mismatch': decoratedRules.S4275,
  'no-this-alias': decoratedRules.S4327,
  'html-has-lang': decoratedRules.S5254,
  'unnecessary-character-escapes': decoratedRules.S6535,
  'no-misused-promises': decoratedRules.S6544,
  'no-base-to-string': decoratedRules.S6551,
  'prefer-string-starts-ends-with': decoratedRules.S6557,
  'no-redundant-type-constituents': decoratedRules.S6571,
  'prefer-enum-initializers': decoratedRules.S6572,
  'prefer-function-type': decoratedRules.S6598,
  'prefer-nullish-coalescing': decoratedRules.S6606,
  'no-extend-native': decoratedRules.S6643,
  'no-useless-constructor': decoratedRules.S6647,
  'no-lonely-if': decoratedRules.S6660,
  'prefer-object-spread': decoratedRules.S6661,
  'prefer-spread': decoratedRules.S6666,
  'no-useless-call': decoratedRules.S6676,
  'no-self-compare': decoratedRules.S6679,
  'no-unknown-property': decoratedRules.S6747,
  'jsx-no-useless-fragment': decoratedRules.S6749,
  'no-find-dom-node': decoratedRules.S6788,
  'anchor-has-content': decoratedRules.S6827,
  'anchor-is-valid': decoratedRules.S6844,
  'label-has-associated-control': decoratedRules.S6853,
  'no-self-import': decoratedRules.S7060,
  'no-unused-expressions': decoratedRules.S905,
  'rules-of-hooks': decoratedRules.S6440,
};

const recommendedLegacyConfig: Linter.Config = { plugins: ['sonarjs'], rules: {} };
const recommendedConfig: Linter.FlatConfig & {
  rules: Linter.RulesRecord;
} = {
  name: 'sonarjs/recommended',
  plugins: {
    sonarjs: {
      rules,
    },
  },
  rules: {},
  settings: {
    react: {
      version: '999.999.999',
    },
  },
};

for (const [key, rule] of Object.entries(rules)) {
  const recommended = rule.meta?.docs?.recommended || false;

  recommendedConfig.rules[`sonarjs/${key}`] = recommended ? 'error' : 'off';
}

recommendedLegacyConfig.rules = recommendedConfig.rules;
recommendedLegacyConfig.settings = recommendedConfig.settings;

export const configs = {
  recommended: recommendedConfig,
  'recommended-legacy': recommendedLegacyConfig,
};

/**
 * I kept the meta export for compatibility, but we need to find a way to populate it without relying on the package manifest
 */
export const meta = {
  name: 'eslint-plugin-sonarjs',
  version: '0.0.0-SNAPSHOT',
};

export default { rules, configs, meta };
