#!/usr/bin/env node

import { execa } from "execa";
import chalk from "chalk";
import { readPackage } from "read-pkg";
import sortPackageJson from "sort-package-json";
import { writePackage } from "write-pkg";

console.log();
console.log(chalk.blue.bold(" npm-init-ex"));
console.log();

await execa("npm", [
  "install",
  "prettier",
  "prettier-config-one",
  "--save-dev",
]);

const packageJson = await readPackage({
  normalize: false,
});

const updatedPackageJson = sortPackageJson({
  ...packageJson,
  prettier: "prettier-config-one",
});

// @ts-expect-error - sort-package-json doesn't return a compatible type
await writePackage(updatedPackageJson);

await execa("npx", ["prettier", "--write", "."]);

console.log(` ${chalk.green("prettier and prettier-config-one added!")}`);
console.log();
