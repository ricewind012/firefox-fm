import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

import { DownloadUtils } from "resource://gre/modules/DownloadUtils.sys.mjs";

import { BASE_URL } from "../consts.js";
import { getFileExtension } from "../utils/file.js";
import { FileActions } from "../file-actions.js";

@customElement("file-row")
class FileRow extends LitElement {
	actions: FileActions;
	menu: {
		toggle(ev: MouseEvent): void;
	};
	selectedDeck: HTMLElement;

	@property({ type: Object }) file: nsIFile = null;
	@property({ type: String }) dir = "";

	static queries = {
		container: "#container",
		menu: "panel-list",
	};

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

	onContextMenu(ev: MouseEvent) {
		ev.preventDefault();
		this.menu.toggle(ev);
	}

	panelListTemplate() {
		return html`
			<panel-list>
				<panel-item accesskey="O" action="open" @click=${this.open}>
					Open
				</panel-item>
				<hr />
				<panel-item accesskey="D" action="delete" @click=${this.actions.delete}>
					Delete
				</panel-item>
			</panel-list>
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
			<link rel="stylesheet" href="${BASE_URL}/components/file-row.css" />
			<link rel="stylesheet" href="${BASE_URL}/panel-list-icons.css" />

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
			<moz-button
				iconsrc="chrome://global/skin/icons/more.svg"
				type="icon ghost"
				@click=${this.onContextMenu}
			></moz-button>

			${this.panelListTemplate()}
		`;
	}
}
