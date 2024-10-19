import { selectNeighboringElement } from "../utils/dom.js";

window.addEventListener("keydown", (ev) => {
	const view = activeComponent;
	const selectedRow =
		view.selectedRow || view.shadowRoot.querySelector(":focus");

	switch (ev.key) {
		case "ArrowUp":
			ev.preventDefault();
			selectNeighboringElement(selectedRow.previousElementSibling);
			break;

		case "ArrowDown":
			ev.preventDefault();
			selectNeighboringElement(selectedRow.nextElementSibling);
			break;

		case "Enter":
			ev.preventDefault();
			selectedRow.open();
			break;
	}
});
