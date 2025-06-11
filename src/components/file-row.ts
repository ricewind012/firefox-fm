import { html } from "lit";
import { customElement, property, query } from "lit/decorators.js";

import { DownloadUtils } from "resource://gre/modules/DownloadUtils.sys.mjs";

import { getFileExtension } from "../utils/file";
import { CBaseElement } from "../utils/lit.js";
import type { ClickEvent } from "../utils/types";

import { ContextMenu } from "./context-menu";
import { FileActions } from "../file-actions";

declare global {
	interface HTMLElementTagNameMap {
		"file-row": FileRow;
	}
}

@customElement("file-row")
class FileRow extends CBaseElement {
	actions: FileActions;
	selectedDeck: HTMLElement;

	@property({ type: Object }) file: nsIFile = null;
	@property({ type: String }) dir = "";

	@query("#container", true) container: HTMLDivElement;
	@query("context-menu", true) menu: HTMLElement;

	connectedCallback() {
		super.connectedCallback();
		this.actions = new FileActions(this.file);
		this.selectedDeck = document.querySelector("view-dir[slot='selected']");
	}

	open() {
		if (this.file.isFile()) {
			this.actions.open();
		} else {
			this.selectedDeck.setAttribute("path", this.file.path);
		}
	}

	onContextMenu(ev: ClickEvent) {
		ev.preventDefault();
		ContextMenu.show(ev, this.contextMenuTemplate());
	}

	contextMenuTemplate() {
		return html`
			<context-menu>
				<context-menu-item @click=${this.open}>Open</context-menu-item>
				<context-menu-separator></context-menu-separator>
				<context-menu-item @click=${this.actions.delete}>
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
			? `moz-icon://.${extension}?size=16`
			: "chrome://global/skin/icons/folder.svg";

		return html`
			<div id="container" tabindex="0" @dblclick=${this.open}>
				<img src="${icon}" />
				<span>${displayName}</span>
				<span>${date}</span>
				<span>
					${isFile &&
					html`
						${bytes} ${unit}
					`}
				</span>
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
