# roblox-animation-transfer

This is a command line utility that allows you to transfer Roblox animations between owners in bulk.

This tool was born out of necessity because unlike other asset types on Roblox, animations are locked to games owned by the owner of the animation.

## Usage
**Pro-tip:** The following examples make use of the `npx` command, which is automatically included when you install [node.js](https://nodejs.org/en/). `npx` allows you to run commands from packages without needing to install the them on your system. As long as you have node.js installed, you can run these commands directly and they'll *just work*.

### .ROBLOSECURITY
In order to upload animations, the `.ROBLOSECURITY` login cookie from Roblox.com is required. The account that the cookie belongs to must have permission to upload animations on the destination group. It is recommended that you use an alternate account for this process.

By default, the tool will use the cookie from Roblox Studio on Windows. You do not need to manually specify the cookie if this works for you.

#### Manually specifying the cookie

You can either set an environment variable named `ROBLOSECURITY` to the value of your cookie, or you can provide the `--cookie`/`-c` option every time you run the command.

In bash, that looks like this:
`$ export ROBLOSECURITY=[YOUR  COOKIE HERE]`

And in PowerShell:
`$ $env:ROBLOSECURITY="[YOUR COOKIE HERE]"`

**The examples below assume you've set the environment variable or are logged into Studio on Windows!**

### Animation List Files
This tool reads in text files that contain a list of animations to upload. In addition to creating them manually, the tool can generate them from a user or a group.

The format is simple: each line begins with the animation ID followed by a space, and the remaining text on the line is used as the animation title.

```
12345 animation name
23423451 second animation name
232323 third animation name
```

You can generate a file with all animations owned by the logged in user or a group ID with the `--list`/`-l` option.

`$ npx roblox-animation-transfer --user --list --outFile animations.txt` will save the list in a file named `animations.txt`

You can omit the `--outFile`/`-o` option, in which case the list is written to stdout.

You could generate a list from a group instead of the logged in user by using the `--group [id]` option.

### Transferring animations

Once you have obtained a list file, either through creating it manually or generating one, you can use it to transfer animations from one owner to another.

`$ npx roblox-animation-transfer --inFile animations.txt --group 12345`

This will download and re-upload all of the animations from `animations.txt` to the new owner. This generates a new animation list file written to stdout.

You can specify an `--outFile` here as well to write the new list to a file instead of stdout. If you omit the `--inFile`, then stdin is used for the input file.

### All together now

Because roblox-animation-transfer can operate purely on stdin and stdout, transferring **all** animations between groups is as simple as just one command (assumes you've set the `ROBLOSECURITY` env variable):

- `$ npx roblox-animation-transfer -g 12345 -l | npx roblox-animation-transfer -g 67890`

In the above example, all animations from group id `12345` will be transferred to group id `67890`.

## Command options
```
Usage: roblox-animation-transfer [options]

Options:
  --outFile, -o     Specify a file to output result to; otherwise stdout is used
                                                                        [string]
  --inFile, -i      Specify a file to read input from; otherwise stdin is used
                                                                        [string]
  --group, -g       The target group id                                 [number]
  --user, -u        Target the logged-in user instead of a group       [boolean]
  --list, -l        Instead of uploading animations, generate a list of
                    animations owned by the specified target.          [boolean]
  --cookie, -c      The .ROBLOSECURITY cookie to use for logging in.
                                                             [string] [required]
  --concurrent, -C  The number of animations to upload concurrently.
                                                           [number] [default: 1]
  -v, --version     show version information                           [boolean]
  -h, --help        show help                                          [boolean]
```
