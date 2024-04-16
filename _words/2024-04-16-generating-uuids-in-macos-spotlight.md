---
title: generating UUIDs in macOS spotlight
date_created: 2024-04-16
date_updated: 2024-04-16
metadata: howto
tags: 
---
# generating UUIDs in macOS spotlight

I find myself having to generate a bunch of UUIDs in my day to day work. Usually this means opening up https://www.uuidgenerator.net/version4 and copying the UUID from there. For some reason the macOS version of `uuidgen` returns in all upppercase and I'd rather have things in lower case.

AppleScript can be run from spotlight if declared as an application so that's probably where I'll start. According to [this](https://discussions.apple.com/thread/616699?sortBy=best) AppleScript doesn't have a native way of generating UUIDs so running a bash script should suffice.

**generating the UUID using bash**

The built in `uuidgen` command should suffice, just need to find a way to convert it to lower case after.

```bash
$ uuidgen
49731849-6FF4-4BAD-BA87-5A98D6B7B6E5
```

`tr` can be used (among other string-processing bash commands) to convert all upper case to lower case. 

```sh
$ uuidgen | tr '[:upper:]' '[:lower:]'
8f8debfc-5f6e-49db-b944-bd6cb11f5d20
```

**creating the AppleScript**

Create a new AppleScript project and embed the script above to generate the UUID. Running the script should print out the randomly-generated lower case UUID. 

```sh
do shell script "uuidgen | tr '[:upper:]' '[:lower:]'"
```

Export the script as an application by going to `File > Export...` and set the File Format parameter to Application.

The output of the script can be extracted by saving to clipboard using the `set the clipboard to ...` syntax.

```sh
set the clipboard to (do shell script "uuidgen | tr '[:upper:]' '[:lower:]'")
```

**TODO**: find a way to print the output to spotlight similar to executing simple math on spotlight. 