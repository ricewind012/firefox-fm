import { html } from "lit";
import { customElement } from "lit/decorators.js";

import { getPathForName, type UserDir_t } from "@utils/file";
import { CBaseElement } from "@utils/lit";

import type { TabItem } from "../components/content";

import "../components/content";
import "@shared/components/contextmenu";
import "@shared/components/shared";
import "../components/sidebar";

declare global {
	interface HTMLElementTagNameMap {
		"fm-app": CFMApp;
	}
}

const vecTopItems: TabItem[] = [
	{ name: "home", text: "Home" },
	{ name: "documents", text: "Documents" },
	{ name: "downloads", text: "Downloads" },
	{ name: "music", text: "Music" },
	{ name: "pictures", text: "Pictures" },
	{ name: "videos", text: "Videos" },
	// TODO
	//{ name: "separator", type: "separator" },
	{ name: "root", text: "File System" },
];
const vecBottomItems: TabItem[] = [{ name: "settings", text: "Settings" }];
const vecAllTabs = [...vecTopItems, ...vecBottomItems];

@customElement("fm-app")
class CFMApp extends CBaseElement {
	static DEFAULT_TAB: UserDir_t = "home";

	render() {
		const path = getPathForName(CFMApp.DEFAULT_TAB);

		return html`
			<fm-sidebar
				.topItems=${vecTopItems}
				.bottomItems=${vecBottomItems}
			></fm-sidebar>
			<fm-content>
				<!-- Only top tabs are intended for usage with the <fm-tabs>
				  -- map in render() -->
				<fm-tabs
					path=${path}
					selectedTab=${CFMApp.DEFAULT_TAB}
					.tabs=${vecTopItems}
				></fm-tabs>
			</fm-content>
		`;
	}
}
