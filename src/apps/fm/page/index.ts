import { html, render } from "lit";
import { customElement } from "lit/decorators.js";

import "@/shared/components/contextmenu";
import "@/shared/components/shared";

import { GetPathForName, type UserDir_t } from "@/utils/file";
import { CBaseElement } from "@/utils/lit";

import type { TabItem } from "../components/content";
import "../components/content";
import "../components/sidebar";

declare global {
	interface HTMLElementTagNameMap {
		"fm-app": CFMApp;
	}
}

const TOP_ITEMS: TabItem[] = [
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
const BOTTOM_ITEMS: TabItem[] = [{ name: "settings", text: "Settings" }];

@customElement("fm-app")
class CFMApp extends CBaseElement {
	static readonly DEFAULT_TAB: UserDir_t = "home";

	override render() {
		const path = GetPathForName(CFMApp.DEFAULT_TAB);

		return html`
			<fm-sidebar
				.topItems=${TOP_ITEMS}
				.bottomItems=${BOTTOM_ITEMS}
			></fm-sidebar>
			<fm-content>
				<!-- Only top tabs are intended for usage with the <fm-tabs>
				  -- map in render() -->
				<fm-tabs
					path=${path}
					selectedTab=${CFMApp.DEFAULT_TAB}
					.tabs=${TOP_ITEMS}
				></fm-tabs>
			</fm-content>
		`;
	}
}

render(
	html`
		<fm-app></fm-app>
	`,
	document.body,
);
