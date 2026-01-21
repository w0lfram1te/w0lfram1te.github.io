var h,
  b,
  st = 'scrollTop',
  sh = 'scrollHeight',
  scroll;

var scrollpos = window.scrollY;
var progress;
var header;
var blink;

/* Progress bar */
//Source: https://alligator.io/js/progress-bar-javascript-css-variables/
document.addEventListener('scroll', function() {

  /*Refresh scroll % width*/
  scroll = (h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight) * 100;
  progress.style.setProperty('--scroll', scroll + '%');

  /*Apply classes for slide in bar*/
  scrollpos = window.scrollY;

  if (scrollpos > 10) {
    header.classList.add("shadow");
    // navcontent.classList.remove("bg-gray-100");
    // navcontent.classList.add("bg-white");
  } else {
    header.classList.remove("shadow");
    // navcontent.classList.remove("bg-white");
    // navcontent.classList.add("bg-gray-100");
  }

});

setInterval(function() {
    blink.style.opacity = (blink.style.opacity == 0 ? 1 : 0);
}, 1000);

function base_onload() {
  blink = document.getElementById('blink');
  header = document.getElementById("header");
  progress = document.querySelector('#progress');

  h = document.documentElement;
  b = document.body;
};

window.addEventListener('DOMContentLoaded', base_onload);