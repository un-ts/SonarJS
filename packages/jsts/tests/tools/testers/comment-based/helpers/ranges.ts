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
export class Range {
  constructor(
    readonly line: number,
    readonly column: number,
    readonly endLine: number,
    readonly endColumn: number,
  ) {}

  toLocationHolder() {
    return {
      loc: {
        start: { line: this.line, column: this.column },
        end: { line: this.endLine, column: this.endColumn },
      },
    };
  }

  toString() {
    return `(${this.line}:${this.column},${this.endLine}:${this.endColumn})`;
  }
}
