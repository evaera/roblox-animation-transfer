#!/usr/bin/env node

import chalk from "chalk"
import * as fs from "fs"
import { findPassword } from "keytar";
import argv from "./argv"
import { getGroupList, getUserList } from "./list"
import getState from "./state"
import transfer from "./transfer"

const fatal = (errorText: string) => {
  console.error(chalk.bold.red(errorText))
  process.exit(1)
}

const assert = (condition: any, errorText: string) => {
  if (!condition) {
    fatal(errorText)
  }
}

async function getCookieFromRobloxStudio(): Promise<undefined | string> {
  if (process.platform !== "win32") {
    return
  }

  const cookie = await findPassword("https://www.roblox.com:RobloxStudioAuth.ROBLOSECURITY")

  if (!cookie) {
    return
  }

  return cookie
}

async function main() {
  assert(
    (argv.group != null && !argv.user) || (argv.group == null && argv.user),
    "Please only specify one of: --user, --group"
  )

  if (argv.inFile && !fs.existsSync(argv.inFile)) {
    fatal(`Specified input file ${argv.inFile} does not exist.`)
  }

  let cookie: string | undefined = await getCookieFromRobloxStudio()

  if (process.env.ROBLOSECURITY) cookie = process.env.ROBLOSECURITY

  if (argv.cookie) cookie = argv.cookie
  if (!cookie)
    fatal(
      "Either set the ROBLOSECURITY environment variable or provide the --cookie option."
    )

  const state = await getState(cookie!)

  const inStream = argv.inFile
    ? fs.createReadStream(argv.inFile)
    : process.stdin
  const outStream = argv.outFile
    ? fs.createWriteStream(argv.outFile)
    : process.stdout

  if (argv.list) {
    await (argv.group
      ? getGroupList(outStream, state, argv.group)
      : getUserList(outStream, state))

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
