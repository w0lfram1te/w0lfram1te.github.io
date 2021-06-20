# w0lfram1te.github.io

## Dependencies
Uses tailwindcss for css and Jekyll for hosting.

Commands to remember:
1. Command to run to modify the stylesheets:
	```bash
	npx tailwindcss -i assets/css/styles.css -o assets/css/tailwind.css --watch
	NODE_ENV=production npx tailwindcss -i assets/css/styles.css -o assets/css/tailwind.css --watch
	```

2. Command to locally execute the Jekyll server:
	```bash
	bundle exec jekyll serve
	```