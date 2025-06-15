import { customElement } from "lit/decorators.js";

declare global {
	interface HTMLElementTagNameMap {
		"life-icon": Icon;
		"life-icon-button": HTMLElement;
		"life-text": HTMLElement;
	}
}

const gtkIcons = new Map([
	["home", "user-home"],
	["documents", "folder-documents"],
	["downloads", "folder-download"],
	["music", "folder-music"],
	["pictures", "folder-pictures"],
	["videos", "folder-videos"],
	["root", "drive-harddisk"],
	["settings", "applications-system"],
]);

@customElement("life-icon")
class Icon extends HTMLElement {
	getCSSValue(name: string) {
		return `-moz-symbolic-icon(${name}-symbolic)`;
	}

	connectedCallback() {
		const name = this.getAttribute("name");
		const icon = gtkIcons.get(name) || name;
		this.style.setProperty("--icon", this.getCSSValue(icon));
	}
}
