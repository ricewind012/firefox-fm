import { html } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";

import { DownloadUtils } from "resource://gre/modules/DownloadUtils.sys.mjs";

import type { CContextMenu } from "@/shared/components/contextmenu";
import { CFileActions } from "@/shared/fileactions";
import {
	GetFileExtension,
	GetPathForName,
	nsIFile,
	type UserDir_t,
} from "@/utils/file";
import { CBaseElement } from "@/utils/lit";
import type { ClickEvent } from "@/utils/types";

import { CBaseTab } from "./base";

declare global {
	interface HTMLElementTagNameMap {
		"fm-file-row": CFileRow;
		"fm-path-part": CPathPart;
		"fm-path-header": CPathHeader;
		"fm-tab": CDirTab;
	}
}

@customElement("fm-file-row")
class CFileRow extends CBaseElement {
	@query("context-menu", true) menu: CContextMenu;
	@state() file: nsIFile = null;

	m_bIsFile: boolean;
	m_elPathHeader: CPathHeader;
	m_elTab: CDirTab;
	m_pActions: CFileActions;

	Open() {
		if (this.m_bIsFile) {
			this.m_pActions.Open();
		} else {
			const { path } = this.file;
			this.m_elPathHeader.path = path;
			this.m_elTab.ChangePath(path);
		}
	}

	OnContextMenu(ev: ClickEvent) {
		this.menu.Show(ev);
	}

	ContextMenuTemplate() {
		return html`
			<context-menu>
				<context-menu-item @click=${this.Open}>Open</context-menu-item>
				<context-menu-separator></context-menu-separator>
				<context-menu-item @click=${this.m_pActions.Delete}>
					Delete
				</context-menu-item>
			</context-menu>
		`;
	}

	override connectedCallback() {
		super.connectedCallback();
		this.m_bIsFile = this.file.isFile();
		this.m_elPathHeader = document.querySelector("fm-path-header");
		this.m_elTab = this.closest("fm-tab-dirs") as unknown as CDirTab;
		this.m_pActions = new CFileActions(this.file);
	}

	override render() {
		const { displayName, fileSize, lastModifiedTime, path } = this.file;

		const date = new Date(lastModifiedTime).toDateString();
		const [bytes, unit] = DownloadUtils.convertByteUnits(fileSize);

		const extension = GetFileExtension(path);
		const icon = this.m_bIsFile
			? html`
					<img src="moz-icon://.${extension}?size=16}" />
				`
			: html`
					<life-icon name="folder"></life-icon>
				`;

		return html`
			<fm-file-row-info-container
				@contextmenu=${this.OnContextMenu}
				@dblclick=${this.Open}
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
			<life-icon-button @click=${this.OnContextMenu}>
				<life-icon name="view-more-horizontal"></life-icon>
				${this.ContextMenuTemplate()}
			</life-icon-button>
		`;
	}
}

@customElement("fm-path-part")
class CPathPart extends CBaseElement {
	@property({ type: String }) name = "";

	override render() {
		return html`
			<life-text>${this.name}</life-text>
		`;
	}
}

@customElement("fm-path-header")
class CPathHeader extends CBaseElement {
	@property({ type: String }) path = "";

	m_elSelectedTab: CDirTab;

	GetDirs() {
		let { path } = this;
		const dirs: { fileName: string; path: string }[] = [];

		while (path) {
			const fileName = PathUtils.filename(path);
			if (!path) {
				continue;
			}

			dirs.unshift({ fileName, path });
			path = PathUtils.parent(path);
		}

		return dirs;
	}

	override connectedCallback() {
		super.connectedCallback();
		this.m_elSelectedTab = this.parentElement as unknown as CDirTab;
	}

	override render() {
		const dirs = this.GetDirs();

		return html`
			${dirs.map(({ path, fileName }) => {
				function OnClick() {
					this.path = path;
					this.m_elSelectedTab.ChangePath(path);
				}

				return html`
					<fm-path-part .name=${fileName} @click=${OnClick}></fm-path-part>
				`;
			})}
		`;
	}
}

@customElement("fm-tab-dirs")
export class CDirTab extends CBaseTab {
	@property({ type: String }) path = "";
	@query("fm-path-header", true) m_elPathHeader: CPathHeader;
	@state() m_vecFiles: nsIFile[];

	ChangePath(strPath: string) {
		const pDir = nsIFile(strPath);
		this.m_vecFiles = [...pDir.directoryEntries];
		//this.m_elPathHeader.path = strPath;
	}

	override connectedCallback() {
		super.connectedCallback();
		const path = GetPathForName(this.name as UserDir_t);
		this.ChangePath(path);
	}

	override render() {
		return html`
			${this.m_vecFiles.map(
				(file) => html`
					<fm-file-row .file=${file}></fm-file-row>
				`,
			)}
		`;
	}
}
