import { html } from "lit";
import { customElement, property, query } from "lit/decorators.js";

import { DownloadUtils } from "resource://gre/modules/DownloadUtils.sys.mjs";

import {
	getFileExtension,
	getPathForName,
	newFile,
	type UserDir_t,
} from "../utils/file";
import { CBaseElement } from "../utils/lit";
import type { ClickEvent } from "../utils/types";

import type { ContextMenu } from "./context-menu";
import { FileActions } from "../file-actions";

declare global {
	interface HTMLElementTagNameMap {
		"fm-content": HTMLElement;
		"fm-file-row": FileRow;
		"fm-path-part": PathPart;
		"fm-path-header": PathHeader;
		"fm-tabs": TabsContainer;
		"fm-tab": DirTab;
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
	 * @todo Consider header ?
	 */
	type?: "separator";
}

export class CTab extends CBaseElement {
	m_elTabs: TabsContainer;
}

@customElement("fm-file-row")
class FileRow extends CBaseElement {
	@property({ type: Object }) file: nsIFile = null;
	@query("context-menu", true) menu: ContextMenu;

	m_Actions: FileActions;

	get m_elSelectedTab() {
		return document.querySelector("fm-tabs");
	}

	constructor() {
		super();
		this.m_Actions = new FileActions(this.file);
	}

	connectedCallback() {
		super.connectedCallback();
		this.addEventListener("contextmenu", this.onContextMenu);
		this.addEventListener("dblclick", this.open);
	}

	open() {
		if (this.file.isFile()) {
			this.m_Actions.open();
		} else {
			this.m_elSelectedTab.setAttribute("path", this.file.path);
		}
	}

	onContextMenu(ev: ClickEvent) {
		this.menu.show(ev);
	}

	contextMenuTemplate() {
		return html`
			<context-menu>
				<context-menu-item @click=${this.open}>Open</context-menu-item>
				<context-menu-separator></context-menu-separator>
				<context-menu-item @click=${this.m_Actions.delete}>
					Delete
				</context-menu-item>
			</context-menu>
		`;
	}

	render() {
		const { displayName, fileSize, lastModifiedTime, path } = this.file;
		const isFile = this.file.isFile();

		const date = new Date(lastModifiedTime).toDateString();
		const [bytes, unit] = DownloadUtils.convertByteUnits(fileSize);

		const extension = getFileExtension(path);
		const icon = isFile
			? html`
					<img src="moz-icon://.${extension}?size=16}" />
				`
			: html`
					<fm-icon name="folder"></fm-icon>
				`;

		return html`
			<fm-file-row-info-container
				@contextmenu=${this.onContextMenu}
				@dblclick=${this.open}
			>
				${icon}
				<fm-text>${displayName}</fm-text>
				<fm-text>${date}</fm-text>
				<fm-text>
					${isFile
						? html`
								${bytes} ${unit}
							`
						: ""}
				</fm-text>
			</fm-file-row-info-container>
			<fm-icon-button @click=${this.onContextMenu}>
				<fm-icon name="view-more-horizontal"></fm-icon>
				${this.contextMenuTemplate()}
			</fm-icon-button>
		`;
	}
}

@customElement("fm-path-part")
class PathPart extends CBaseElement {
	@property({ type: String }) name = "";

	render() {
		return html`
			<fm-text>${this.name}</fm-text>
		`;
	}
}

@customElement("fm-path-header")
class PathHeader extends CBaseElement {
	@property({ type: String }) path = "";

	get m_elSelectedTab() {
		return document.querySelector("fm-tabs");
	}

	getDirs() {
		let { path } = this;
		const dirs: { fileName: string; path: string }[] = [];

		while (path) {
			const fileName = PathUtils.filename(path);
			if (!path) {
				continue;
			}

			dirs.unshift({ path, fileName });
			path = PathUtils.parent(path);
		}

		return dirs;
	}

	render() {
		const dirs = this.getDirs();

		return html`
			${dirs.map(({ path, fileName }) => {
				function onClick() {
					this.m_elSelectedTab.setAttribute("path", path);
					console.log("fm-path-part path = %o", path);
				}

				return html`
					<fm-path-part .name=${fileName} @click=${onClick}></fm-path-part>
				`;
			})}
		`;
	}
}

// TODO: deduct from settings
@customElement("fm-tab")
export class DirTab extends CTab {
	@property({ type: String, attribute: true }) name = "";
	@property({ type: Boolean, attribute: true }) selected = false;

	m_strPath: string;
	m_vecFiles: nsIFile[];

	constructor() {
		super();
		this.m_elTabs = this.parentElement as TabsContainer;

		const path = getPathForName(this.name as UserDir_t);
		console.log(
			"changePath:\npath: %o, getPathForName result: %o, m_elTabs: %o",
			this.m_strPath,
			path,
			this.m_elTabs,
		);
		this.changePath(path);
	}

	/**
	 * @todo Maybe there is a better way for the first condition
	 */
	attributeChangedCallback(name: string, oldValue: string, newValue: string) {
		if (oldValue === newValue) {
			console.log("fm-tab: oldValue === newValue for %o, wtf", name);
			return;
		}

		super.attributeChangedCallback(name, oldValue, newValue);
		//this.changePath(newValue);
		// TODO: ?
		//this.requestUpdate();
	}

	changePath(path: string) {
		const pDir = newFile(path);
		this.m_vecFiles = [...pDir.directoryEntries];
		this.setAttribute("path", path);
		this.m_elTabs.changePath(path);
	}

	render() {
		return html`
			${this.m_vecFiles.map(
				(file) => html`
					<fm-file-row .file=${file}></fm-file-row>
				`,
			)}
		`;
	}
}

@customElement("fm-tabs")
class TabsContainer extends CBaseElement {
	/**
	 * Used to change paths across tabs.
	 */
	@property({ type: String }) path = "";

	/**
	 * Used for sidebar items to indicate if they're currently selected.
	 */
	@property({ type: String, attribute: true }) selectedTab = "";

	@property({ type: Array }) tabs: TabItem[] = [];

	/*
	attributeChangedCallback(
		name: string,
		oldValue: string,
		newValue: string,
	): void {
		console.warn("attributeChangedCb: %o, %o, %o", name, oldValue, newValue);
		if (oldValue === newValue) {
			return;
		}

		super.attributeChangedCallback(name, oldValue, newValue);
		//this.requestUpdate();
	}
		*/

	ChangeVisibleTab(strName: string) {
		this.selectedTab = strName;
	}

	changePath(path: string) {
		this.setAttribute("path", path);
	}

	render() {
		const { tabs, selectedTab } = this;

		return html`
			${tabs.map(
				(tab) => html`
					<fm-tab name=${tab.name} ?hidden=${tab.name !== selectedTab}>
						<fm-file-row-info-container>
							<div></div>
							<fm-text>Name</fm-text>
							<fm-text>Date</fm-text>
							<fm-text>Size</fm-text>
						</fm-file-row-info-container>
					</fm-tab>
				`,
			)}
		`;
	}
}
