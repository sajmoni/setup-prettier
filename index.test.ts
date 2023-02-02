import { expect, test } from "vitest";
import { execa } from "execa";
import { temporaryDirectory } from "tempy";
import { PackageJson, readPackage } from "read-pkg";
import { name } from "./package.json";

test(name, async () => {
  const directory = temporaryDirectory({ prefix: "hello-world" });
  const { stdout } = await execa(name, [], {
    cwd: directory,
    env: {
      // @ts-expect-error
      FORCE_COLOR: 2,
    },
  });

  const packageJson = (await readPackage({
    cwd: directory,
    normalize: false,
  })) as PackageJson & {
    prettier: string;
  };

  expect(packageJson.prettier).toEqual("prettier-config-one");
  console.log("stdout", stdout);
  expect(stdout).toMatchSnapshot();
});
