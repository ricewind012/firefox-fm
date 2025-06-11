import { html, render } from "lit";
import { customElement, property } from "lit/decorators.js";

import { CBaseElement } from "../utils/lit";
import type { ClickEvent } from "../utils/types";

declare global {
	interface HTMLElementTagNameMap {
		"context-menu": HTMLElement; //ContextMenu;
		"context-menu-item": ContextMenuItem;
		"context-menu-overlay": ContextMenuOverlay;
		"context-menu-separator": HTMLElement;
	}
}

const elMenu = document.querySelector("context-menu");
const elMenuOverlay = document.querySelector("context-menu-overlay");

@customElement("context-menu-overlay")
class ContextMenuOverlay extends HTMLElement {
	connectedCallback() {
		this.addEventListener("click", () => {
			this.hidden = true;
		});
	}
}

//@customElement("context-menu")
// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class ContextMenu {
	static show(ev: ClickEvent, content) {
		const { height, x, y } = ev.target.getBoundingClientRect();
		elMenu.style.setProperty("--offset-x", x.toString());
		elMenu.style.setProperty("--offset-y", (height + y).toString());
		elMenuOverlay.hidden = false;

		ev.preventDefault();
		render(content, elMenu);
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
