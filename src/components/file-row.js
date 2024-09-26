import { html, LitElement } from "chrome://global/content/vendor/lit.all.mjs";

import { BASE_URL } from "../consts.js";
import { getFileExtension, newFile } from "../file-utils.js";

/**
 * File actions wrapper class, maybe for future prompt usage...
 */
class FileActions {
	constructor(file) {
		this.file = file;
	}

	delete() {
		this.file.remove(false);
	}

	open() {
		this.file.launch();
	}
}

class FileRow extends LitElement {
	get file() {
		if (!this._file) {
			this._file = newFile(this.path);
		}
		return this._file;
	}

	get menu() {
		if (!this._menu) {
			this._menu = this.shadowRoot.querySelector("panel-list");
		}
		return this._menu;
	}

	connectedCallback() {
		super.connectedCallback();
		this.path = this.getAttribute("path");
		// This has to be below the above line because of the file getter.
		this.actions = new FileActions(this.file);
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
					@click=${this.actions.open}
				>Open</panel-item>
				<hr />
				<panel-item
					accesskey="D"
					@click=${this.actions.delete}
				>Delete</panel-item>
			</panel-list>
		`;
	}

	render() {
		const basename = PathUtils.filename(this.path);
		const extension = getFileExtension(this.path);
		const icon = this.file.isFile()
			? `moz-icon://.${extension}?size=16`
			: "chrome://global/skin/icons/folder.svg";

		return html`
			<link
				rel="stylesheet"
				href="${BASE_URL}/components/file-row.css"
			/>

			<moz-button
				iconsrc="${icon}"
				@dblclick=${this.actions.open}
			>${basename}</moz-button>
			<moz-button
				iconsrc="chrome://global/skin/icons/more.svg"
				@click=${this.onContextMenu}
			></moz-button>

			${this.panelListTemplate()}
		`;
	}
}

customElements.define("file-row", FileRow);
