import { html } from "lit";
import { customElement } from "lit/decorators.js";

import { getPathForName } from "../utils/file";
import { CBaseElement } from "../utils/lit";
import type { TabItem } from "../components/content";

import "../components/content";
import "../components/context-menu";
import "../components/shared";
import "../components/sidebar";

declare global {
	interface HTMLElementTagNameMap {
		"fm-app": App;
	}
}

const vecTopItems: TabItem[] = [
	{ name: "home", text: "Home" },
	{ name: "documents", text: "Documents" },
	{ name: "downloads", text: "Downloads" },
	{ name: "music", text: "Music" },
	{ name: "pictures", text: "Pictures" },
	{ name: "videos", text: "Videos" },
	{ name: "root", text: "File System" },
];
const vecBottomItems: TabItem[] = [{ name: "settings", text: "Settings" }];
const vecAllTabs = [...vecTopItems, ...vecBottomItems];

@customElement("fm-app")
class App extends CBaseElement {
	render() {
		const DEFAULT_TAB = "home";
		const path = getPathForName(DEFAULT_TAB);
		console.log(path);

		return html`
			<fm-sidebar
				.topItems=${vecTopItems}
				.bottomItems=${vecBottomItems}
			></fm-sidebar>
			<fm-content>
				<fm-path-header .path=${path}></fm-path-header>
				<fm-tabs selectedTab=${DEFAULT_TAB} .tabs=${vecAllTabs}></fm-tabs>
			</fm-content>
		`;
	}
}
