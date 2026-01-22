---
title: Implementing Dark Mode on Tailwind v4
date_created: 2026-01-14
date_updated: 2026-01-19
metadata: other
---
# Implementing Dark Mode on Tailwind v4

So I finally got around to working on implementing dark mode quite some time after the last major redesign. It's been so long that Tailwind v4 was released (the site was previously running on Tailwind v2 if I recall correctly). The upgrade to v4 was another thing altogether but that's for another day.

This will be less of a "how to" guide and more outlining the steps and mishaps while I try to figure out the process. I figure there's already a wealth of resources on _how its done_ and not a lot on telling a story of _how they figured it out_.

## Specifications

I had an initial implementation spec in mind for dark mode:
- must be an easy-to-find button that swaps between light and dark mode icons
- must persist the user's preference even after refreshing
- must be implemented such that maintenance is simple (admittedly, this is a bit vague)

Additional good-to-haves that I've discovered while working on the feature:
- using user preferences on dark/light mode on first visit

## Implementation

With the above specifications in mind, I started slowly whittling down the problem by breaking it down into smaller and more manageable chunks.
### toggling dark mode via CSS selector

Initially referencing the documentation on the Tailwind site, I suppose the bare minimum would be to be able to specify light and dark mode backgrounds and swapping between the two (even if it needs to be done manually for now).

```html
<body class="bg-white dark:bg-gray-800">
...
</body>
```

The above code says that `bg-white` will be used if the `dark` class isn't specified in the same element or any of the parent elements (so in this case either the `body` element or the `html` element). Once the `dark:bg-gray-800` class was added I was stuck on the dark background whether or not the `dark` class is specified. I must have missed something. 

Looking at the [documentation](https://tailwindcss.com/docs/dark-mode#toggling-dark-mode-manually), I found that Tailwind strictly follows the `prefers-color-scheme` browser setting and ignores the `dark` class indicator. I didn't want to dive too deep into browser configuration so I opted to just override that and stick with controlling dark mode via the `dark` CSS selector.

I added the following line to `styles.css` and, sure enough, adding and removing the `dark` class to the `body` element now allows me to swap between dark and light backgrounds.

```css
@import "tailwindcss";@custom-variant dark (&:where(.dark, .dark *));
```

For the final implementation I opted to add `dark` to the root `html` element instead.

### adding CSS selectors via javascript 

I assumed the only way to add the `dark` class was via Javascript. Since I've been wanting an excuse to learn more Javascript I didn't bother validating that assumption and decided to push through with JS. Since it's been a while since I last touched it, though, I opted to created three buttons to break the problem down further:
- one to set light mode 
- one to set dark mode
- one to toggle between light and dark

```html
<button id="setlightMode">light mode</button>
<button id="setDarkMode">light mode</button>
<button id="darkModeToggle">light mode</button>
```

Then I created the corresponding selectors to pick out the component and the associated `EventListeners`:

```javascript
const darkModeToggle = document.querySelector('#darkModeToggle');
const setLight = document.querySelector('#setlightMode');
const setDark = document.querySelector('#setdarkMode');

darkModeToggle.addEventListener('click', toggleDarkMode);
setLight.addEventListener('click', setLightMode);
setDark.addEventListener('click', setDarkMode);
```

It'll be easier to figure this out by first working on the `setLight` and `setDark` since it may be more straightforward than toggling. These will persist the selected theme to the `theme` variable in `localStorage` and then add or remove the `dark` class to the `html` element.

```javascript
function setLightMode() {
	localStorage.theme = "light";
	document.documentElement.classList.remove("dark");
}

function setDarkMode() {
	localStorage.theme = "dark";
	document.documentElement.classList.add("dark");
}
```

This should have worked but I was running into the issue of the variables being assigned before they were declared resulting in all of them being `null`. 

Manually running `document.querySelector('#darkModeToggle');` on the console would result in selecting the correct element which means the script itself is correct. This leads me to believe that the query is being run and assigned to the `const` variable before the HTML element was initialized/loaded in.

### waiting for elements to load-in

I needed to find a way to wait for the element to be initialized before the javascript ran. I previously solved this by loading in the `<script>` later on in the HTML but this seemed clunky to me now. 

Looking to google I found an implementation on [stackoverflow.com](https://stackoverflow.com/questions/5525071/how-to-wait-until-an-element-exists) that involved using `MutationObserver` and `Promise` - as I didn't know as much about developing in Javascript it looked to be an elegant solution to my problem.

Explaining the problem to a friend who knew a bit more recommended to use `window.onload()` which saved me from over-engineering things, thankfully.

```javascript
window.onload = (event) => {
	// assign variables here
}
```

Well that fixed it and it allowed me to swap between dark and light mode using the buttons.

### figuring out toggling between icons 

I wanted a button that would toggle between dark mode and light mode and an icon that would reflect the changes. Thankfully I saw an implementation online that involves using the `hidden` and `block` classes. 

Having two elements with the inverse setting of the other would result in one element being visible and another being invisible in either dark or light modes.

```html
<button id="darkModeToggle"> 
	<span class="block dark:hidden"><!--light mode icon here --></span>
	<span class="dark:block hidden"><!--dark mode icon here --></span>	
</button>
```

### loading in SVGs and dynamically changing colors

Initially I was considering creating custom PNGs for dark mode and light mode to match the typography colors in the current design. Luckily I ran into the SVGs on [heroicons.com](https://heroicons.com/) from the makers of Tailwind and then finding the [tailwindcss.com - svg / fill](https://tailwindcss.com/docs/fill) classes.

This allows me to have the element inherit the stroke / fill colors that are configured via the typography module. So if I were to change the header font colors, I wouldn't need to recompile the images every time. 

```html
  <svg class="size-5 fill-current ...">
```

## Wrapping up

All in all, the implementation has a couple of rough edges but this should be serviceable in the mean time while I figure out the other design aspects of the site.

The next steps design-wise would likely be tightening up the use of Tailwind and focusing on a "mobile-first" approach which involves designing the website for mobile and then scaling everything up to desktop. 