import { html } from "lit";
import { customElement, property } from "lit/decorators.js";

import { CBaseElement } from "../utils/lit";
import type { ClickEvent } from "../utils/types";

declare global {
	interface HTMLElementTagNameMap {
		"context-menu": ContextMenu;
		"context-menu-item": ContextMenuItem;
		//"context-menu-overlay": ContextMenuOverlay;
		"context-menu-separator": HTMLElement;
	}
}

//document.addEventListener("mousedown");

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
		*/
		//console.assert(!!this.parentTag, "[parent-name] must be provided!");
		document.addEventListener("mousedown", this.onDocumentClick);
		window.addEventListener("keydown", (ev: KeyboardEvent) => {
			if (ev.key === "Escape") {
				this.hide();
			}
		});
	}

	onDocumentClick(ev: ClickEvent) {
		const menu = ev.target.closest(
			"context-menu",
		) as unknown as ContextMenu | null;
		console.log("ondocclick: target = %o, menu = %o", ev.target, menu);
		if (menu !== this) {
			this.hide();
		}
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
			<fm-icon name=${icon}></fm-icon>
			<fm-text>${text}</fm-text>
		`;
	}
}
