---
title: Deploying Python Scripts with Docker
date_created: 2022-08-01
date_updated: 2022-08-01
metadata: howto
tags: 
---
# Deploying Python Scripts with Docker

For quick setup information, kindly refer to the tl;dr at the bottom of the post.

To deploy a python script in a container on Docker, one of the options would be to create the image from scratch as indicated in the [Python Docker Hub](https://hub.docker.com/_/python/) page as shown below.

```Dockerfile
FROM python:3

WORKDIR /usr/src/app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD [ "python", "./your-daemon-or-script.py" ]
```

Provided that you have all the necessary items to run your script in the same directory as the Dockerfile, this should be sufficient in creating and deploying the script. This will create a python-based image that, when deployed, should run your script without much effort.

To compile and run the image, run the following commands in the root directory of your project:

```bash
docker build . -t custom_python_script_image
docker run custom_python_script_image
```

## Migrating to Docker Compose 

Previously this setup was sufficient and worked well enough but would frequently run into a few issues:

1. Iterative work with this configuration takes more time as modifying the script would require rebuilding the entire image. 

2.  This will not allow data to persist between restarts. So when your restarts or power is cut-off from your home lab you can say goodbye to all of the data you've collected. 

To address these issues I considered using a Docker compose file to provide runtime configuration and declaring volumes for persistence. As a bonus, any additional container orchestration would be much easier in a compose file.

### Improved Dockerfile

Working off of the provided Dockerfile above, I ended up with the following Dockerfile:

```Dockerfile
FROM python:3

WORKDIR /home/

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# run the script
CMD ["python"]
```

Since I didn't want to keep installing requirements every time I restarted the container, I opted to have the requirements be part of the base image. The workdir home was moved from `/usr/src/app` to `/home` as a personal preference.

More importantly, the application code and other files are no longer part of the base image. 

### Base docker-compose.yaml

The compose file should allow modification of any part of the script without having to recompile; all you would need to do to is to re-run the compose file. Save the code block with the default compose file name `docker-compose.yaml` .

```yaml
services:
	app:
		build: .
		command: python3 /home/main.py
		volumes: 
		- ${PWD}:/home/
```

Quick explanation of the compose file:
- `build: .` - would look for a Dockerfile in the same directory for building the image
- `command: python3 /home/main.py` - indicates the main python file to be run
- `volumes: ...` - mounts the entire project directory inside the image and makes it persistent across restarts. This means that any modifications done to files will reflect in the host filesystem.

To run this, simply run the code below. If the requirements file was changed we can force a rebuildof the image by adding the `--build` flag to the `docker-compose` command.

```bash
docker-compose up
```

## tl;dr

Your project folder should look something like this:

```
project_folder
|  Dockerfile
|  docker-compose.yaml
|  main.py
|  requirements.txt
```

`Dockerfile`:

```Dockerfile
FROM python:3

WORKDIR /home/

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# run the script
CMD ["python"]
```

`docker-compose.yaml`:

```yaml
services:
	app:
		build: .
		command: python3 /home/main.py
		volumes: 
		- ${PWD}:/home/
```

Alternatively, the base directory structure should be in the `python` folder of this [repository](https://github.com/w0lfram1te/composes).