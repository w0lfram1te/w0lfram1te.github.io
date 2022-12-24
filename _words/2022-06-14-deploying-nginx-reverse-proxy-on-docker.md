---
title: Deploying Nginx Reverse Proxy on Docker
date_created: 2022-06-14
date_updated: 
metadata: howto
tags: 
---
# Deploying Nginx Reverse Proxy on Docker

Reverse Proxies are used to bring traffic to and from a web server in a protected part of the network. In the context of docker, we'll be using the reverse proxy to have each web service be referred to using its own subdomain.

For example, a user will access `sync.example-domain.com` and be directed to the reverse proxy. The reverse proxy will then see this and forward the request to the appropriate container on the server.

An additional perk of using a reverse proxy here would be having consolidated logging across all of the services on your server, and for having a single point where protections such as IP allow listing can take place independent of the web services.

## Configuring the Nginx Conf file

- **Log Persistence** was done by creating a volume to hold all the logs. 
- **Templating** is enabled through the docker image's custom function. More information can be found on the [nginx docker page](https://hub.docker.com/_/nginx).

## Building the container using docker-compose

Deploy the reverse proxy on your machine by pulling the repository, modifying the relevant environment variables in the `docker-compose.yaml` file and running `docker-compose up -d` to run it in daemon mode.

## Future Improvements

As a proof-of-concept, this will work as it is. This still needs to have additional improvements such as SSL support. Updates will be done on the [repository](https://github.com/w0lfram1te/nginx-reverse-proxy) moving forward.

## References
- [nginx docker page](https://hub.docker.com/_/nginx)
- [nginx reverse proxy example](https://www.nginx.com/resources/wiki/start/topics/examples/reverseproxycachingexample/)