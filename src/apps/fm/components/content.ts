import { html } from "lit";
import { customElement, property, query } from "lit/decorators.js";

import { GetPathForName, type UserDir_t } from "@/utils/file";
import { CBaseElement } from "@/utils/lit";

import type { CBaseTab } from "./tabs/base";
import "./tabs/dir";
import "./tabs/settings";

declare global {
	interface HTMLElementTagNameMap {
		"fm-content": HTMLElement;
		"fm-tabs": CTabsContainer;
	}
}

export interface TabItem {
	/**
	 * Internal name, not localized.
	 */
	name: UserDir_t | "root" | "settings";

	/**
	 * Localized text.
	 */
	text: string;

	/**
	 * Item type.
	 */
	type?: "separator";
}

@customElement("fm-tabs")
export class CTabsContainer extends CBaseElement {
	/**
	 * Used for:
	 * - `<fm-app>` render with last used tab
	 * - sidebar items to indicate if they're currently selected
	 */
	@property({ attribute: true, type: String }) selectedTab = "";

	@property({ type: Array }) tabs: TabItem[] = [];

	@query(":scope > :not([hidden])") selectedTabEl: CBaseTab;

	ChangeVisibleTab(strName: string) {
		this.selectedTab = strName;
		this.selectedTabEl.hidden = true;
		const elNewTab = this.GetTab(strName);
		elNewTab.hidden = false;
	}

	GetTab<T extends CBaseTab = CBaseTab>(strName: string) {
		return this.querySelector<T>(`:scope > [name="${strName}"]`);
	}

	override render() {
		const { tabs, selectedTab } = this;

		return html`
			${tabs.map((tab) => {
				const path = GetPathForName(tab.name as UserDir_t);

				return html`
					<fm-tab-dirs name=${tab.name} ?hidden=${tab.name !== selectedTab}>
						<fm-path-header path=${path}></fm-path-header>
						<fm-file-row-info-container>
							<div></div>
							<life-text>Name</life-text>
							<life-text>Date</life-text>
							<life-text>Size</life-text>
						</fm-file-row-info-container>
					</fm-tab-dirs>
				`;
			})}
			<fm-tab-settings name="settings" ?hidden=${true}></fm-tab-settings>
		`;
	}
}
