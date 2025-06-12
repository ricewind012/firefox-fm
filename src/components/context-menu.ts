import { html } from "lit";
import { customElement, property } from "lit/decorators.js";

import { CBaseElement } from "../utils/lit";
import type { ClickEvent } from "../utils/types";

declare global {
	interface HTMLElementTagNameMap {
		"context-menu": ContextMenu;
		"context-menu-item": ContextMenuItem;
		"context-menu-overlay": ContextMenuOverlay;
		"context-menu-separator": HTMLElement;
	}
}

@customElement("context-menu-overlay")
class ContextMenuOverlay extends HTMLElement {
	connectedCallback() {
		this.hide();
		this.addEventListener("click", () => {
			this.hide();
		});
		this.addEventListener("keydown", (ev: KeyboardEvent) => {
			if (ev.key === "Escape") {
				this.hide();
			}
		});
	}

	hide() {
		this.hidden = true;
	}
}

@customElement("context-menu")
export class ContextMenu extends HTMLElement {
	overlay = this.parentElement as ContextMenuOverlay;
	parentTag = this.getAttribute("parent-name") as keyof HTMLElementTagNameMap;

	connectedCallback() {
		console.assert(
			this.overlay.localName === "context-menu-overlay",
			"Parent must be a <context-menu-overlay>!",
		);
		console.assert(!!this.parentTag, "[parent-name] must be provided!");
	}

	show(ev: ClickEvent) {
		ev.preventDefault();

		const { height, x, y } = ev.target
			.closest(this.parentTag)
			.getBoundingClientRect();
		this.style.setProperty("--offset-x", x.toString());
		this.style.setProperty("--offset-y", (height + y).toString());
		this.overlay.hidden = false;
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
