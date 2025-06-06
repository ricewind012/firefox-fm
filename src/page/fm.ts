import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

const ITEMS_FOR_NOW: {
	name: string;
	iconURL: string;
}[] = [
	{ name: "home", iconURL: "chrome://browser/skin/home.svg" },
	{ name: "documents", iconURL: "chrome://global/skin/icons/folder.svg" },
	{
		name: "downloads",
		iconURL: "chrome://browser/skin/downloads/downloads.svg",
	},
	{ name: "music", iconURL: "chrome://global/skin/media/audio.svg" },
	{ name: "pictures", iconURL: "resource://gre-resources/password.svg" },
	{
		name: "videos",
		iconURL: "chrome://browser/skin/notification-icons/camera.svg",
	},
	{ name: "root", iconURL: "chrome://browser/skin/device-desktop.svg" },
	{
		name: "settings",
		iconURL: "chrome://browser/skin/preferences/category-general.svg",
	},
];

@customElement("fm-sidebar-item")
class SidebarItem extends LitElement {
	@property({ type: String }) name = "";
	@property({ type: String }) iconURL = "";

	render() {
		return html`
			<img src=${this.iconURL} />
			${this.name}
		`;
	}
}

@customElement("fm-sidebar")
class Sidebar extends LitElement {
	render() {
		const items = ITEMS_FOR_NOW.map(
			(item) => html`
				<div name=${item.name} iconURL=${item.iconURL}></div>
			`,
		);

		return html`
			${items}
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"fm-sidebar": Sidebar;
		"fm-sidebar-item": SidebarItem;
	}
}
