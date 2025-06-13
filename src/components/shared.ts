import { customElement } from "lit/decorators.js";

declare global {
	interface HTMLElementTagNameMap {
		"fm-icon": Icon;
		"fm-icon-button": HTMLElement;
		"fm-text": HTMLElement;
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

@customElement("fm-icon")
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
