applyTheme();

// create elements with the indicated #ids to manipulate the theme
function theme_onload() {
  const darkModeToggle = document.querySelector('#darkModeToggle');
	darkModeToggle.addEventListener('click', toggleDarkMode);

	// const setLight = document.querySelector('#setlightMode');
	// const setDark = document.querySelector('#setdarkMode');
	// setLight.addEventListener('click', setLightMode);
	// setDark.addEventListener('click', setDarkMode);
};

window.addEventListener('DOMContentLoaded', theme_onload);


function applyTheme() {
  document.documentElement.classList.toggle(
    "dark",
    localStorage.theme === "dark" ||
      (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches),
  );
};

function setLightMode() {
	localStorage.theme = "light";
	document.documentElement.classList.remove("dark");
}

function setDarkMode() {
	localStorage.theme = "dark";
	document.documentElement.classList.add("dark");
}

function toggleDarkMode() {
	document.documentElement.classList.toggle("dark");

	if (document.documentElement.classList.contains("dark")) {
		localStorage.theme = "dark"
	} else {
		localStorage.theme = "light"
	}
}