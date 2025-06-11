import { html } from "lit";
import { customElement, property } from "lit/decorators.js";

import { getPathForName, type UserDir_t } from "../utils/file";
import { CBaseElement } from "../utils/lit";

declare global {
	interface HTMLElementTagNameMap {
		"fm-content": HTMLElement;
		"fm-path-part": PathPart;
		"fm-path-header": PathHeader;
		"fm-tabs": TabsContainer;
		"fm-tab": Tab;
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
}

@customElement("fm-path-part")
class PathPart extends CBaseElement {
	@property({ type: Boolean }) divider = false;
	@property({ type: String }) name = "";
	@property({ type: String }) path = "";

	selectedTab: Tab = document.querySelector("fm-tab[selected]");

	onClick() {
		this.selectedTab.setAttribute("path", this.path);
	}

	render() {
		return html`
			<button @click=${this.onClick}>${this.name}</button>
			${this.divider
				? html`
						<span class="divider">/</span>
					`
				: ""}
		`;
	}
}

@customElement("fm-path-header")
class PathHeader extends CBaseElement {
	@property({ type: String }) path = "";

	render() {
		let { path } = this;
		let i = 0;
		// 1 for /
		const length = PathUtils.split(path).length - 1;
		const dirs = [];

		while (path) {
			const divider = i !== 0 && i !== length;
			const fileName = PathUtils.filename(path);
			if (!path) {
				continue;
			}

			i++;
			dirs.unshift({ divider, path, fileName, i });
			path = PathUtils.parent(path);
		}

		return html`
			${dirs.map(
				({ divider, path, fileName }) => html`
					<fm-path-part
						.divider=${divider}
						.path=${path}
						.name=${fileName}
					></fm-path-part>
				`,
			)}
		`;
	}
}

@customElement("fm-tab")
export class Tab extends CBaseElement {
	@property({ type: String, attribute: true }) name = "";
	@property({ type: String }) path = "";
	@property({ type: Boolean, attribute: true }) selected = false;

	constructor() {
		super();
		this.path = getPathForName(this.name as UserDir_t);
		this.changePath(this.path);
	}

	changePath(path: string) {
		const elTabsContainer = document.querySelector("fm-tabs");
		elTabsContainer.changePath(path as UserDir_t);
	}

	render() {
		const { path, name } = this;

		return html`
			<div>${path}</div>
			<div>${name}</div>
		`;
	}
}

@customElement("fm-tabs")
class TabsContainer extends CBaseElement {
	@property({ type: String }) path = "";
	@property({ type: Array }) tabs: TabItem[] = [];
	@property({ type: String, attribute: true }) selectedTab = "";

	attributeChangedCallback(
		name: string,
		oldValue: string,
		newValue: string,
	): void {
		console.warn(
			"attributeChangedCallback: %o, %o, %o",
			name,
			oldValue,
			newValue,
		);
		if (oldValue === newValue) {
			return;
		}

		super.attributeChangedCallback(name, oldValue, newValue);
		this.changePath(newValue as UserDir_t);
		//this.requestUpdate();
	}

	changePath(name: UserDir_t) {
		const path = getPathForName(name);
		this.setAttribute("path", path);
	}

	render() {
		const { tabs, selectedTab } = this;

		return html`
			${tabs.map(
				(tab) => html`
					<fm-tab name=${tab.name} ?hidden=${tab.name !== selectedTab}></fm-tab>
				`,
			)}
		`;
	}
}
