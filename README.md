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

#### Installing npm

via apt:

```sh
sudo apt install npm
sudo npm install -g n
sudo n stable
```

via brew:

```sh
brew install npm 
```

#### Installing via npm

reference: https://tailwindcss.com/docs/installation/tailwind-cli

```sh
npm install tailwindcss@4.1 @tailwindcss/cli@4.1.18 @tailwindcss/typography@0.4.1
# can also install by running npm install if package.json is available
# old method npm install -D tailwindcss@latest postcss@latest autoprefixer@latest @tailwindcss/typography
```

```sh
npx @tailwindcss/cli -i ./assets/css/styles.css -o ./assets/css/tailwind.css
```

- https://github.com/tailwindlabs/tailwindcss-typography
- 

### Jekyll
```bash
sudo apt install ruby ruby-dev
gem install jekyll bundler
```

## Compiling tailwindcss
Commands to remember:
1. Command to run to modify the stylesheets:
	```bash
	npx tailwindcss -i assets/css/styles.css -o assets/css/tailwind.css --watch
	NODE_ENV=production npx tailwindcss -i assets/css/styles.css -o assets/css/tailwind-prod.css --watch
	```

2. Command to locally execute the Jekyll server:
	```bash
	bundle exec jekyll serve
	```
