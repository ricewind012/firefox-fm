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
	@property({ type: String }) name = "";
	@property({ type: String }) text = "";
	@property({ type: Boolean }) selected = false;

	render() {
		const { name, text } = this;

		return html`
			<fm-icon name=${name}></fm-icon>
			<fm-text>${text}</fm-text>
		`;
	}
}

@customElement("fm-sidebar")
class Sidebar extends CBaseElement {
	@property({ type: Array }) topItems: TabItem[] = [];
	@property({ type: Array }) bottomItems: TabItem[] = [];

	@query("context-menu") menu: ContextMenu;

	get pathHeader() {
		return document.querySelector("fm-path-header");
	}

	contextMenuTemplate(item: TabItem) {
		const onClick = (ev: ClickEvent<SidebarItem>) => this.onItemClick(ev, item);

		return html`
			<context-menu-overlay>
				<context-menu parent-name="fm-sidebar-item">
					<context-menu-item text="Open" @click=${onClick}></context-menu-item>
				</context-menu>
			</context-menu-overlay>
		`;
	}

	onContextMenu(ev: ClickEvent) {
		this.menu.show(ev);
	}

	onItemClick(ev: ClickEvent<SidebarItem>, item: TabItem) {
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

	itemTemplate(item: TabItem) {
		if (item.type === "separator") {
			return html`
				<fm-sidebar-separator></fm-sidebar-separator>
			`;
		}

		return html`
			<fm-sidebar-item
				name=${item.name}
				.text=${item.text}
				?selected=${item.name === "home"}
				@click=${(ev: ClickEvent<SidebarItem>) => this.onItemClick(ev, item)}
				@contextmenu=${(ev: ClickEvent<SidebarItem>) => this.onContextMenu(ev)}
			>
				${this.contextMenuTemplate(item)}
			</fm-sidebar-item>
		`;
	}

	render() {
		const { topItems, bottomItems } = this;

		return html`
			${topItems.map((item) => this.itemTemplate(item))}
			<fm-sidebar-spacer></fm-sidebar-spacer>
			${bottomItems.map((item) => this.itemTemplate(item))}
		`;
	}
}
