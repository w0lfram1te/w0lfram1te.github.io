# w0lfram1te.github.io

## Quickstart (Docker)

```bash
docker-compose up &
```

**Troubleshooting**
- if updates to local files are not appearing in the local deployment, remove the local build directories and compile from scratch.

```sh
rm -rf _site/*
```

## Dependencies
- npm/tailwindcss
- Jekyll

### npm/tailwindcss

Compiling Tailwind CSS using the Tailwind CLI. Requires npm to be installed.

#### Installing via npm

**fulfilling npm requirements**

```sh

# unix / apt
sudo apt install npm
sudo npm install -g n
sudo n stable

# macos / brew
brew install npm
```

```sh
npm install tailwindcss@4.1 @tailwindcss/cli@4.1.18 @tailwindcss/typography@0.4.1
# can also install by running npm install if package.json is available
```

references:
- https://tailwindcss.com/docs/installation/tailwind-cli
- https://github.com/tailwindlabs/tailwindcss-typography

### Jekyll

**fulfilling ruby requirements**

```bash
# unix / apt
sudo apt install ruby ruby-dev

# macos / brew
brew install rbenv
brew install rbenv 4.0.0
rbenv global 4.0.0
```

```sh
gem install jekyll bundler
```

## Compiling tailwindcss
Commands to remember:
1. Command to run to modify the stylesheets:
	```bash
	npx @tailwindcss/cli -i ./assets/css/styles.css -o ./assets/css/tailwind.css --watch
	```

2. Command to locally execute the Jekyll server:
	```bash
	bundle exec jekyll serve
	```
