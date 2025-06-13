import { html } from "lit";
import { customElement, property, query } from "lit/decorators.js";

import type { TabItem } from "./content";
import type { ContextMenu } from "./context-menu";

import { CBaseElement } from "../utils/lit";
import type { ClickEvent } from "../utils/types";

declare global {
	interface HTMLElementTagNameMap {
		"fm-sidebar": Sidebar;
		"fm-sidebar-item": SidebarItem;
	}
}

@customElement("fm-sidebar-item")
class SidebarItem extends CBaseElement {
	@property({ type: Object }) item: TabItem = null;
	@property({ type: Boolean }) selected = false;
	@query("context-menu") menu: ContextMenu;

	get pathHeader() {
		return document.querySelector("fm-path-header");
	}

	connectedCallback() {
		super.connectedCallback();
		this.addEventListener("click", this.onClick);
		this.addEventListener("contextmenu", this.onContextMenu);
	}

	contextMenuTemplate() {
		return html`
			<context-menu parent-name="fm-sidebar-item">
				<context-menu-item
					text="Open"
					@click=${this.onClick}
				></context-menu-item>
			</context-menu>
		`;
	}

	onContextMenu(ev: ClickEvent) {
		this.menu.show(ev);
	}

	onClick(ev: ClickEvent<SidebarItem>) {
		const { item } = this;
		const tabsContainer = document.querySelector("fm-tabs");
		const { selectedTab } = tabsContainer;
		if (selectedTab === item.name) {
			return;
		}

		tabsContainer.setAttribute("selectedtab", item.name);
		this.pathHeader.setAttribute("path", "asd");

		document
			.querySelector<SidebarItem>("fm-sidebar-item[selected]")
			.removeAttribute("selected");
		const target = ev.target.closest("fm-sidebar-item");
		target.setAttribute("selected", "true");
	}

	render() {
		const { name, text } = this.item;

		return html`
			${this.contextMenuTemplate()}
			<fm-icon name=${name}></fm-icon>
			<fm-text>${text}</fm-text>
		`;
	}
}

@customElement("fm-sidebar")
class Sidebar extends CBaseElement {
	@property({ type: Array }) topItems: TabItem[] = [];
	@property({ type: Array }) bottomItems: TabItem[] = [];

	itemTemplate(item: TabItem) {
		if (item.type === "separator") {
			return html`
				<fm-sidebar-separator></fm-sidebar-separator>
			`;
		}

		return html`
			<fm-sidebar-item
				.item=${item}
				?selected=${item.name === "home"}
			></fm-sidebar-item>
		`;
	}

	render() {
		const { topItems, bottomItems } = this;

		return html`
			${topItems.map((item) => this.itemTemplate(item))}
			<fm-sidebar-spacer></fm-sidebar-spacer>
			<!--${bottomItems.map((item) => this.itemTemplate(item))}-->
		`;
	}
}
