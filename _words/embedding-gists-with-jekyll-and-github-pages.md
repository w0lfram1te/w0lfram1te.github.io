---
title: Embedding Gists with Jekyll and Github Pages
date_created: 2022-11-06
date_updated: 
metadata: research
---
# Embedding Gists with Jekyll and Github Pages

Github gists can be embedded into Jekyll pages using the `gist` tag. 

## Configuring Jekyll 

Follow the installation guide indicated [here](https://github.com/jekyll/jekyll-gist). The steps are listed here for reference just in case.

Steps are as follows:

1. Append the `jekyll-gist` following package to your `Gemfile`. 

```
gem 'jekyll-gist'
```

2. Add the package to the `_config.yml` file as shown.

```
plugins:
  - jekyll-gist
```

3. Add the dependency to `Gemfile.lock`.

```
DEPENDENCIES
  ...
  jekyll-gist
```

## Adding the Gist to the Post

Now we can embed existing gists using the `gist` Liquid template tag and the gist ID.

For the gist URL below the gist_id will be `c1d2dcfd507a9a1fd5848af60ac92d70`.

> https://gist.github.com/w0lfram1te/c1d2dcfd507a9a1fd5848af60ac92d70 

The template to be inserted should then look as shown below.

```
{{ "{% gist c1d2dcfd507a9a1fd5848af60ac92d70 " }}%}
```

Which renders into this nifty little code block:

{% gist c1d2dcfd507a9a1fd5848af60ac92d70 %}