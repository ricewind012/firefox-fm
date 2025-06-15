import { html } from "lit";
import { customElement, property } from "lit/decorators.js";

import { CBaseElement } from "@utils/lit";
import type { ClickEvent } from "@utils/types";

declare global {
	interface HTMLElementTagNameMap {
		"context-menu": ContextMenu;
		"context-menu-item": ContextMenuItem;
		//"context-menu-overlay": ContextMenuOverlay;
		"context-menu-separator": HTMLElement;
	}
}

/*
@customElement("context-menu-overlay")
class ContextMenuOverlay extends HTMLElement {
	connectedCallback() {
		this.hide();
		this.addEventListener("click", () => {
			this.hide();
		});
		window.addEventListener("keydown", (ev: KeyboardEvent) => {
			if (ev.key === "Escape") {
				this.hide();
			}
		});
	}

	hide() {
		this.hidden = true;
	}
}
	*/

/**
 * @note Put me directly inside the parent whose position you want me to use.
 * @todo Use `<body>` --> `<context-menu-overlay>` and put all menus there - all
 * the document/window events fire when I do literally anything.
 */
@customElement("context-menu")
export class ContextMenu extends HTMLElement {
	//overlay = this.parentElement as ContextMenuOverlay;
	/** @todo Use element ref maybe ? */
	//parentTag = this.getAttribute("parent-name") as keyof HTMLElementTagNameMap;

	connectedCallback() {
		this.hide();
		/*
		console.assert(
			this.overlay.localName === "context-menu-overlay",
			"Parent must be a <context-menu-overlay>!",
		);
		console.assert(!!this.parentTag, "[parent-name] must be provided!");
		*/
		document.addEventListener("mouseup", (ev: MouseEvent) => {
			// only catch left click
			if (ev.which === 1) {
				this.hide();
			}
		});
		window.addEventListener("keydown", (ev: KeyboardEvent) => {
			if (ev.key === "Escape") {
				this.hide();
			}
		});
	}

	show(ev: ClickEvent) {
		ev.preventDefault();

		/*
		const { height, x, y } = ev.target
			.closest(this.parentTag)
			.getBoundingClientRect();
			*/
		const { height, x, y } = this.parentElement.getBoundingClientRect();
		this.style.setProperty("--offset-x", x.toString());
		this.style.setProperty("--offset-y", (height + y).toString());
		//this.overlay.hidden = false;
		this.hidden = false;
	}

	hide() {
		this.hidden = true;
	}
}

@customElement("context-menu-item")
class ContextMenuItem extends CBaseElement {
	@property({ type: String }) icon = "";
	@property({ type: String }) text = "";

	render() {
		const { icon, text } = this;

		return html`
			<life-icon name=${icon}></life-icon>
			<life-text>${text}</life-text>
		`;
	}
}
