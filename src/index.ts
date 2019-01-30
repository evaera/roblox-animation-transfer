#!/usr/bin/env node

import chalk from 'chalk'
import * as fs from 'fs'
import argv from './argv'
import { getGroupList, getUserList } from './list'
import getState from './state'
import transfer from './transfer'

const fatal = (errorText: string) => {
  console.error(chalk.bold.red(errorText))
  process.exit(1)
}

const assert = (condition: any, errorText: string) => {
  if (!condition) {
    fatal(errorText)
  }
}

async function main () {
  assert(
    (argv.group != null && !argv.user)
    || (argv.group == null && argv.user)
    , 'Please only specify one of: --user, --group'
  )

  if (argv.inFile && !fs.existsSync(argv.inFile)) {
    fatal(`Specified input file ${argv.inFile} does not exist.`)
  }

  const state = await getState(argv.cookie)

  const inStream = argv.inFile ? fs.createReadStream(argv.inFile) : process.stdin
  const outStream = argv.outFile ? fs.createWriteStream(argv.outFile) : process.stdout

  if (argv.list) {
    await (argv.group ? getGroupList(outStream, state, argv.group) : getUserList(outStream, state))

    if (argv.outFile) {
      console.log(chalk.green(`Pulled animations, wrote to: ${argv.outFile}`))
    }
  } else {
    try {
      transfer(inStream, outStream, state, argv.concurrent, argv.group)
    } catch (e) {
      fatal(e.toString())
    }
  }
}

main().catch((e: Error) => fatal(e.message + e.stack))
