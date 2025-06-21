import { customElement } from "lit/decorators.js";

declare global {
	interface HTMLElementTagNameMap {
		"life-icon": CGTKIcon;
		"life-icon-button": HTMLElement;
		"life-text": HTMLElement;
	}
}

@customElement("life-icon")
class CGTKIcon extends HTMLElement {
	static s_mapIcons = new Map([
		["home", "user-home"],
		["documents", "folder-documents"],
		["downloads", "folder-download"],
		["music", "folder-music"],
		["pictures", "folder-pictures"],
		["videos", "folder-videos"],
		["root", "drive-harddisk"],
		["settings", "applications-system"],
	]);

	GetCSSValue(name: string) {
		return `-moz-symbolic-icon(${name}-symbolic)`;
	}

	override connectedCallback() {
		const name = this.getAttribute("name");
		const icon = CGTKIcon.s_mapIcons.get(name) || name;
		this.style.setProperty("--icon", this.GetCSSValue(icon));
	}
}
