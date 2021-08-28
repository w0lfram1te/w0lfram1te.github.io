---
title: Creating POST requests with curl
date_created: 2021-08-28
date_updated: 
metadata: research
---
# Creating POST requests with curl

I find myself ~~frequently~~ occasionally confusing different types of POST requests when attempting to build them using curl. So I bit the bullet and dedicated an entire post to it so next time I hopefully remember.

## POST request encoding types

According to [this](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST) reference, there are three different (basic) encoding types for POST requests. The encoding is declared in the `Content-Type` header.

1. `application/x-www-form-urlencoded` - requests are encoded in `key=value` format and delimited by ampersands `&`.

	```
	POST / HTTP/1.1
	Host: w0lfram1te.com
	Content-Type: application/x-www-form-urlencoded
	Content-Length: X
	
	username=username&password=password
	```

	Sample curl request for url-encoded forms:
	
	```bash
	curl -X POST https://w0lfram1te.com/ -d "username=username&password=password"
	```

2. `multipart/form-data` - requests are split by a line delimiter defined in the `Content-Type` request header. 

	```
	POST / HTTP/1.1
	Host: w0lfram1te.com
	Content-Type: multipart/form-data; boundary=------------foobar
	Content-Length: X
	
	------------foobar
	Content-Disposition: form-data; name="username"
	
	username
	------------foobar
	Content-Disposition: form-data; name="password"
	
	password
	------------foobar	
	```

	Sample curl request for multipart forms:
	
	```bash
	curl -X POST https://w0lfram1te.com/ -F "username=username" -F "password=password"
	```

3. `text/plain`

## Sample curl Requests

A note about the behavior of curl before proceeding: curl will determine the MIME type on its own in some situations. Other times it might be beneficial to explicitly declare the MIME type and other contextual bits depending on the circumstances.

Refer to [this](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types) for more information on MIME types and what to put in the `Content-Type` header.

### Sending Files

**As a multipart form:** 

The content-type and filename will be inferred from the provided file. If these need to be explicitly set (for example, bypassing file extension checks) we can  declare that like this: `"image=@image.png";type=text/plain;filename=image.jpg`

```bash
curl -X POST http://127.0.0.1:8000/test -F "image=@image.png"
```

```
POST /fileupload HTTP/1.1
Host: w0lfram1te.com
Content-Type: multipart/form-data; boundary=------------foobar
Content-Length: X

boundary=------------foobar
Content-Disposition: form-data; name="image"; filename="image.png"
Content-Type: image/png

<binary_data>
boundary=------------foobar
```

**As raw data:**

We make use of the `-d` flag to send the data. Remember to declare the content-type explicitly otherwise it will send it using `application/x-www-form-urlencoded`.

```bash
curl -X POST http://127.0.0.1:8000/test -d "@image.png" -H "Content-Type: image/png"
```

```
POST /fileupload HTTP/1.1
Host: w0lfram1te.com
Content-Type: image/png
Content-Length: X

<binary_data>
```

### Sending JSON Requests

Considering how JSON is a very common format, I thought it would be helpful to provide the format for sending JSON requests. The MIME type for JSON is `application/json`.

```bash
curl -X POST http://127.0.0.1:8000/test -d '{"username":"username","password":"password"}' -H "Content-Type: application/json"
```

```
POST /fileupload HTTP/1.1
Host: w0lfram1te.com
Content-Type: image/png
Content-Length: X

<binary_data>
```

### Other Curl Tips - Proxying Requests

I tested these out with the help of Burpsuite to confirm how the requests would look like and how to get to the desired request format. Add the following flag to the command to route all requests through the Burpsuite Listener.

```bash
-x http://127.0.0.1:8080
```