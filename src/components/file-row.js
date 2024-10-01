import { html, when } from "chrome://global/content/vendor/lit.all.mjs";
import { MozLitElement } from "chrome://global/content/lit-utils.mjs";

import { DownloadUtils } from "resource://gre/modules/DownloadUtils.sys.mjs";

import { BASE_URL } from "../consts.js";
import { getFileExtension } from "../file-utils.js";
import { FileActions } from "../file-actions.js";

class FileRow extends MozLitElement {
	static properties = {
		file: { type: Object },
		dir: { type: String },
	};

	static queries = {
		container: "#container",
		menu: "panel-list",
	};

	connectedCallback() {
		super.connectedCallback();
		this.actions = new FileActions(this.file);
	}

	onClick() {
		if (this.getAttribute("selected")) {
			this.removeAttribute("selected");
		} else {
			this.setAttribute("selected", "");
		}
	}

	/**
	 * @param {MouseEvent} ev
	 */
	onContextMenu(ev) {
		ev.preventDefault();
		this.menu.toggle(ev);
	}

	panelListTemplate() {
		return html`
			<panel-list>
				<panel-item
					accesskey="O"
					action="open"
					@click=${this.actions.open}
				>Open</panel-item>
				<hr />
				<panel-item
					accesskey="D"
					action="delete"
					@click=${this.actions.delete}
				>Delete</panel-item>
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
			<link
				rel="stylesheet"
				href="${BASE_URL}/components/file-row.css"
			/>
			<link
				rel="stylesheet"
				href="${BASE_URL}/panel-list-icons.css"
			/>

			<div
				id="container"
				@click=${this.onClick}
				@dblclick=${this.actions.open}
			>
				<img src="${icon}" />
				<span>${displayName}</span>
				<span>${date}</span>
				<span>
					${when(isFile, () => html`${bytes} ${unit}`)}
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

customElements.define("file-row", FileRow);
