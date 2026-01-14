applyTheme();

// create elements with the indicated #ids to manipulate the theme
window.onload = (event) => {
	const darkModeToggle = document.querySelector('#darkModeToggle');
	darkModeToggle.addEventListener('click', toggleDarkMode);

	// const setLight = document.querySelector('#setlightMode');
	// const setDark = document.querySelector('#setdarkMode');
	// setLight.addEventListener('click', setLightMode);
	// setDark.addEventListener('click', setDarkMode);

	const darkModeIcon = document.querySelector("#darkModeIcon");
	const lightModeIcon = document.querySelector("#lightModeIcon");
};

function applyTheme() {
  document.body.classList.toggle(
    "dark",
    localStorage.theme === "dark" ||
      (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches),
  );
};

function setLightMode() {
	localStorage.theme = "light";
	document.body.classList.remove("dark");
}

function setDarkMode() {
	localStorage.theme = "dark";
	document.body.classList.add("dark");
}

function toggleDarkMode() {
	document.body.classList.toggle("dark");

	if (document.body.classList.contains("dark")) {
		localStorage.theme = "dark"
	} else {
		localStorage.theme = "light"
	}
}