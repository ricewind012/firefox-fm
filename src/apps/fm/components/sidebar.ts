import { html } from "lit";
import { customElement, property, query } from "lit/decorators.js";

import type { CContextMenu } from "@/shared/components/contextmenu";
import { CBaseElement } from "@/utils/lit";
import type { ClickEvent } from "@/utils/types";

import type { TabItem } from "./content";

declare global {
	interface HTMLElementTagNameMap {
		"fm-sidebar": CSidebar;
		"fm-sidebar-item": CSidebarItem;
	}
}

@customElement("fm-sidebar-item")
class CSidebarItem extends CBaseElement {
	@property({ type: Object }) item: TabItem = null;
	@property({ type: Boolean }) selected = false;
	@query("context-menu", true) menu: CContextMenu;

	ContextMenuTemplate() {
		return html`
			<context-menu>
				<context-menu-item
					text="Open"
					@click=${this.OnClick}
				></context-menu-item>
			</context-menu>
		`;
	}

	OnContextMenu(ev: ClickEvent) {
		this.menu.Show(ev);
	}

	OnClick() {
		const { item } = this;
		const tabsContainer = document.querySelector("fm-tabs");
		const { selectedTab } = tabsContainer;
		if (selectedTab === item.name) {
			return;
		}

		tabsContainer.ChangeVisibleTab(item.name);
		document
			.querySelector<CSidebarItem>("fm-sidebar-item[selected]")
			.removeAttribute("selected");
		this.selected = true;
	}

	override connectedCallback() {
		super.connectedCallback();
		this.addEventListener("click", this.OnClick);
		this.addEventListener("contextmenu", this.OnContextMenu);
	}

	override render() {
		const { name, text } = this.item;

		return html`
			<life-icon name=${name}></life-icon>
			<life-text>${text}</life-text>

			${this.ContextMenuTemplate()}
		`;
	}
}

@customElement("fm-sidebar")
class CSidebar extends CBaseElement {
	@property({ type: Array }) topItems: TabItem[] = [];
	@property({ type: Array }) bottomItems: TabItem[] = [];

	ItemTemplate(item: TabItem) {
		if (item.type === "separator") {
			return html`
				<fm-sidebar-separator></fm-sidebar-separator>
			`;
		}

		return html`
			<fm-sidebar-item
				.item=${item}
				?selected=${item.name === /* CFMApp.DEFAULT_TAB */ "home"}
			></fm-sidebar-item>
		`;
	}

	override render() {
		const { topItems, bottomItems } = this;

		return html`
			${topItems.map((item) => this.ItemTemplate(item))}
			<fm-sidebar-spacer></fm-sidebar-spacer>
			${bottomItems.map((item) => this.ItemTemplate(item))}
		`;
	}
}
