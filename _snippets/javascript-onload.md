---
title: Using Javscript window.onload in multiple files
date_created: 2026-01-21
date_updated: 2026-01-21
metadata: snippets
slug: 32de01f784084d99962289b31e917c5e
---

Apparently you can't use window.onload() in multiple Javascript files. Instead of that, we can just use the `load` or `DOMContentLoaded` event and create a listener for that to run the function. I used [this](https://www.delftstack.com/howto/javascript/window.onload-functionality-usage-with-example-in-html/#best-practices-for-using-window-onload) as a reference.


```javascript
function base_onload() {
  blink = document.getElementById('blink');
  header = document.getElementById("header");
  progress = document.querySelector('#progress');

  h = document.documentElement;
  b = document.body;
};

window.addEventListener('DOMContentLoaded', base_onload);
```