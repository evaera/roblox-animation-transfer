# roblox-animation-transfer

This is a command line utility that allows you to transfer Roblox animations between owners in bulk.

This tool was born out of necessity because unlike other asset types on Roblox, animations can only be used in games with the same owner as the animation.

## Usage
**Pro-tip:** These examples show the command prefixed by `npx`, which allows you to run it without needing to install the package directly. As long as you have [node.js and npm](https://nodejs.org/en/) installed, you can just run these commands and they'll *just work*.

### .ROBLOSECURITY
In order to upload animations, the `.ROBLOSECURITY` login cookie from Roblox.com is required. The account that the cookie belongs to must have permission to upload animations on the destination group. It is recommended that you use an alternate account for this process.

You can either set an environment variable named `ROBLOSECURITY` to the value of your cookie, or you can provide the `--cookie`/`-c` option every time you run the command.

### Animation List Files
This tool operates on text files that contain lists of animations. This tool has the ability to generate these files from an owner, in addition to reading them.

The format is simple: each line begins with the animation ID followed by a space, and the remaining text on the line is used as the animation title.

```
12345 animation name
23423451 second animation name
232323 third animation name
```

You can generate a file with all animations owned by the logged in user or a group ID with the `--list`/`-l` option.

`$ npx roblox-animation-transfer --user --list --outFile animations.txt --cookie [.ROBLOSECURITY COOKIE HERE]` will save the list in a file named `animations.txt`

You can omit the `--outFile`/`-o` option, in which case the list is written to stdout.

You could generate a list from a group instead of the logged in user by using the `--group [id]` option.

### Transferring animations

Once you have obtained a list file, either through creating it manually or generating one, you can use it to transfer animations from one owner to another.

`$ npx roblox-animation-transfer --inFile animations.txt --group 12345 --cookie [.ROBLOSECURITY COOKIE HERE]`

This will download and re-upload all of the animations from `animations.txt` to the new owner, and generate a new animation list file which is written to stdout.

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
