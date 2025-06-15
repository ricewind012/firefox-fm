import { html } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";

import { DownloadUtils } from "resource://gre/modules/DownloadUtils.sys.mjs";

import type { ContextMenu } from "@shared/components/contextmenu";
import { FileActions } from "@shared/fileactions";
import {
	getFileExtension,
	getPathForName,
	newFile,
	type UserDir_t,
} from "@utils/file";
import { CBaseElement } from "@utils/lit";
import type { ClickEvent } from "@utils/types";

import { CBaseTab } from "./base";

declare global {
	interface HTMLElementTagNameMap {
		"fm-file-row": FileRow;
		"fm-path-part": PathPart;
		"fm-path-header": PathHeader;
		"fm-tab": DirTab;
	}
}

@customElement("fm-file-row")
class FileRow extends CBaseElement {
	@query("context-menu", true) menu: ContextMenu;
	@state() file: nsIFile = null;

	m_bIsFile: boolean;
	m_elPathHeader: PathHeader;
	m_elTab: DirTab;
	m_pActions: FileActions;

	connectedCallback() {
		super.connectedCallback();
		this.m_bIsFile = this.file.isFile();
		this.m_elPathHeader = document.querySelector("fm-path-header");
		this.m_elTab = this.closest("fm-tab-dirs") as unknown as DirTab;
		this.m_pActions = new FileActions(this.file);
	}

	open() {
		if (this.m_bIsFile) {
			this.m_pActions.open();
		} else {
			const { path } = this.file;
			this.m_elPathHeader.path = path;
			this.m_elTab.ChangePath(path);
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
				<context-menu-item @click=${this.m_pActions.delete}>
					Delete
				</context-menu-item>
			</context-menu>
		`;
	}

	render() {
		const { displayName, fileSize, lastModifiedTime, path } = this.file;

		const date = new Date(lastModifiedTime).toDateString();
		const [bytes, unit] = DownloadUtils.convertByteUnits(fileSize);

		const extension = getFileExtension(path);
		const icon = this.m_bIsFile
			? html`
					<img src="moz-icon://.${extension}?size=16}" />
				`
			: html`
					<life-icon name="folder"></life-icon>
				`;

		return html`
			<fm-file-row-info-container
				@contextmenu=${this.onContextMenu}
				@dblclick=${this.open}
			>
				${icon}
				<life-text>${displayName}</life-text>
				<life-text>${date}</life-text>
				<life-text>
					${this.m_bIsFile
						? html`
								${bytes} ${unit}
							`
						: ""}
				</life-text>
			</fm-file-row-info-container>
			<life-icon-button @click=${this.onContextMenu}>
				<life-icon name="view-more-horizontal"></life-icon>
				${this.contextMenuTemplate()}
			</life-icon-button>
		`;
	}
}

@customElement("fm-path-part")
class PathPart extends CBaseElement {
	@property({ type: String }) name = "";

	render() {
		return html`
			<life-text>${this.name}</life-text>
		`;
	}
}

@customElement("fm-path-header")
class PathHeader extends CBaseElement {
	@property({ type: String }) path = "";

	m_elSelectedTab: DirTab;

	connectedCallback() {
		super.connectedCallback();
		this.m_elSelectedTab = this.parentElement as unknown as DirTab;
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
					this.path = path;
					this.m_elSelectedTab.ChangePath(path);
				}

				return html`
					<fm-path-part .name=${fileName} @click=${onClick}></fm-path-part>
				`;
			})}
		`;
	}
}

@customElement("fm-tab-dirs")
export class DirTab extends CBaseTab {
	@property({ type: String }) path = "";
	@query("fm-path-header", true) m_elPathHeader: PathHeader;
	@state() m_vecFiles: nsIFile[];

	connectedCallback() {
		super.connectedCallback();
		const path = getPathForName(this.name as UserDir_t);
		this.ChangePath(path);
	}

	ChangePath(strPath: string) {
		const pDir = newFile(strPath);
		this.m_vecFiles = [...pDir.directoryEntries];
		//this.m_elPathHeader.path = strPath;
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
