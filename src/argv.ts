import * as yargs from 'yargs'

const versionString = require('../package.json').version as string

const argv = yargs
  .usage('Usage: roblox-animation-transfer [options]')

  .alias('v', 'version')
  .version(versionString)
  .describe('version', 'show version information')

  .alias('h', 'help')
  .help('help')
  .describe('help', 'show help')
  .showHelpOnFail(false, 'specify --help for available options')

  .option('outFile', {
    alias: 'o',
    desc: 'Specify a file to output result to; otherwise stdout is used',
    string: true
  })

  .option('inFile', {
    alias: 'i',
    desc: 'Specify a file to read input from; otherwise stdin is used',
    string: true
  })

  .option('group', {
    alias: 'g',
    desc: 'The target group id',
    number: true
  })

  .option('user', {
    alias: 'u',
    desc: 'Target the logged-in user instead of a group',
    boolean: true
  })

  .option('list', {
    alias: 'l',
    desc: 'Instead of uploading animations, generate a list of animations owned by the specified target.',
    boolean: true
  })

  .option('cookie', {
    alias: 'c',
    desc: 'The .ROBLOSECURITY cookie to use for logging in.',
    string: true
  })

  .option('concurrent', {
    alias: 'C',
    desc: 'The number of animations to upload concurrently.',
    number: true,
    default: 1
  })

  .parse()

export default argv
