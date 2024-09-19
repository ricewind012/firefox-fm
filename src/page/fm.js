// Stolen from firefoxview.mjs
// I guess some stuff is not ready for usage in other pages yet

function onHashChange() {
	let view = document.location?.hash.substring(1);
	if (!view || !pageList.includes(view)) {
		view = "home";
	}
	changeView(view);
}

function changeView(view) {
	viewsDeck.selectedViewName = view;
	pageNav.currentView = view;
}

function onViewsDeckViewChange() {
	for (const child of viewsDeck.children) {
		if (child.getAttribute("name") === viewsDeck.selectedViewName) {
			try {
				child.enter();
			} catch (e) {}
			activeComponent = child;
		} else {
			try {
				child.exit();
			} catch (e) {}
		}
	}
}

let pageList = [];
let viewsDeck = null;
let pageNav = null;
let activeComponent = null;

window.addEventListener("DOMContentLoaded", () => {
	pageList = [];
	pageNav = document.querySelector("moz-page-nav");
	viewsDeck = document.querySelector("named-deck");

	for (const item of pageNav.pageNavButtons) {
		pageList.push(item.getAttribute("view"));
	}
	window.addEventListener("hashchange", onHashChange);
	window.addEventListener("change-view", (ev) => {
		location.hash = ev.target.getAttribute("view");
		window.scrollTo(0, 0);
	});

	viewsDeck.addEventListener("view-changed", onViewsDeckViewChange);

	// set the initial state
	onHashChange();
	onViewsDeckViewChange();
});
