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

	/**
	 * Item type.
	 * @todo Consider header ?
	 */
	type?: "separator";
}

const divider = html`
	<fm-path-part-divider></fm-path-part-divider>
`;

@customElement("fm-file-row")
class FileRow extends CBaseElement {
	actions: FileActions;
	selectedTab: Tab;

	@property({ type: Object }) file: nsIFile = null;

	@query("#container", true) container: HTMLDivElement;
	@query("context-menu", true) menu: ContextMenu;

	connectedCallback() {
		super.connectedCallback();
		this.actions = new FileActions(this.file);
		this.selectedTab = document.querySelector("fm-tab[selected]");
	}

	open() {
		if (this.file.isFile()) {
			this.actions.open();
		} else {
			this.selectedTab.setAttribute("path", this.file.path);
		}
	}

	onContextMenu(ev: ClickEvent) {
		this.menu.show(ev);
	}

	contextMenuTemplate() {
		return html`
			<context-menu-overlay>
				<context-menu>
					<context-menu-item @click=${this.open}>Open</context-menu-item>
					<context-menu-separator></context-menu-separator>
					<context-menu-item @click=${this.actions.delete}>
						Delete
					</context-menu-item>
				</context-menu>
			</context-menu-overlay>
		`;
	}

	render() {
		const { displayName, fileSize, lastModifiedTime, path } = this.file;
		const isFile = this.file.isFile();

		const date = new Date(lastModifiedTime).toDateString();
		const [bytes, unit] = DownloadUtils.convertByteUnits(fileSize);

		const extension = getFileExtension(path);
		const icon = isFile
			? `moz-icon://.${extension}?size=16`
			: "chrome://global/skin/icons/folder.svg";

		return html`
			<div
				id="container"
				tabindex="0"
				@contextmenu=${this.onContextMenu}
				@dblclick=${this.open}
			>
				<img src="${icon}" />
				<div>${displayName}</div>
				<div>${date}</div>
				<div>
					${isFile &&
					html`
						${bytes} ${unit}
					`}
				</div>
			</div>
			<button
				iconsrc="chrome://global/skin/icons/more.svg"
				type="icon ghost"
				@click=${this.onContextMenu}
			></button>

			${this.contextMenuTemplate()}
		`;
	}
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
			${this.divider ? divider : ""}
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

	files: nsIFile[];

	/**
	 * @todo Maybe there is a better way for the first condition
	 */
	attributeChangedCallback(name: string, oldValue: string, newValue: string) {
		if (oldValue === newValue) {
			console.log("fm-tab: oldValue === newValue for %o, wtf", name);
			return;
		}

		super.attributeChangedCallback(name, oldValue, newValue);
		this.changePath(newValue);
		// TODO: ?
		this.requestUpdate();
	}

	/**
	 * @param path Dir path.
	 */
	changePath(path?: string) {
		const dir = path || getPathForName(this.name as UserDir_t);
		console.log(
			"changePath:\path: %o, getPathForName result: %o",
			path,
			getPathForName(this.name as UserDir_t),
		);
		try {
			const pDir = newFile(dir);
			this.files = [...pDir.directoryEntries];
		} catch (_e) {
			console.error("err for %o", dir);
		}
		this.setAttribute("path", dir);

		const elTabsContainer = document.querySelector("fm-tabs");
		elTabsContainer.changePath(path as UserDir_t);
	}

	connectedCallback() {
		// TODO: deduct from settings
		this.path = getPathForName(this.name as UserDir_t);
		this.changePath(this.path);
	}

	render() {
		const { path, name } = this;

		return html`
			<div style="flex-direction: column">
				path -
				<div style="color: #f09">${path}</div>
				name -
				<div style="color: #f09">${name}</div>
			</div>

			${this.files.map(
				(file) => html`
					<fm-file-row .file=${file}></fm-file-row>
				`,
			)}
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
