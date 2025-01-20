import fs from 'node:fs/promises'
import path from 'node:path'
import { expect, test } from 'vitest'
import { execa } from 'execa'
import { temporaryDirectory } from 'tempy'
import { type PackageJson, readPackage } from 'read-pkg'
import { getBinPath } from 'get-bin-path'

import { name } from './package.json'

test(name, async () => {
  const binPath = await getBinPath()
  if (!binPath) {
    throw new Error('Bin path not found')
  }

  const directory = temporaryDirectory({ prefix: 'hello-world' })
  const unFormatted = 'console.log("hello world");'

  await fs.writeFile(path.join(directory, 'index.js'), unFormatted)

  const { stdout } = await execa(binPath, [], {
    cwd: directory,
    env: {
      FORCE_COLOR: '2',
    },
  })

  const formattedFile = await fs.readFile(
    path.join(directory, 'index.js'),
    'utf-8',
  )
  expect(formattedFile).toEqual("console.log('hello world')\n")

  const packageJson = (await readPackage({
    cwd: directory,
    normalize: false,
  })) as PackageJson & {
    prettier: string
    devDependencies: Record<string, string>
  }

  expect(packageJson.prettier).toEqual('prettier-config-one')
  expect(Object.keys(packageJson.devDependencies)).toEqual([
    'prettier',
    'prettier-config-one',
  ])
  console.log('stdout', stdout)
  expect(stdout).toMatchSnapshot()
})
