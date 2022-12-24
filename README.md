# w0lfram1te.github.io

## Quickstart (Docker)

```bash
docker-compose up &
```

## Dependencies
- npm/tailwindcss
- Jekyll

### npm/tailwindcss
```bash
sudo apt install npm
sudo npm install -g n
sudo n stable
```
```bash
npm install -D tailwindcss@latest postcss@latest autoprefixer@latest @tailwindcss/typography
```

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

