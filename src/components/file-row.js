import { html } from "chrome://global/content/vendor/lit.all.mjs";
import { MozLitElement } from "chrome://global/content/lit-utils.mjs";

import { newFile } from "../file-utils.js";

/**
 * File actions wrapper class, maybe for future prompt usage...
 * @todo nsIFile.clone() doesn't work, so I have to create yet another copy...
 */
class FileActions {
	constructor(path) {
		this.file = newFile(path);
	}

	delete() {
		this.file.remove(false);
	}

	open() {
		this.file.launch();
	}
}

class FileRow extends MozLitElement {
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
		this.actions = new FileActions(this.path);
	}

	/**
	 * @param {MouseEvent} ev
	 * @todo <panel-list> doesn't work with <moz-button>
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
		return html`
			<button
				@click=${this.actions.open}
				@contextmenu=${this.onContextMenu}
			>
				${PathUtils.filename(this.path)}
			</button>

			${this.panelListTemplate()}
		`;
	}
}

customElements.define("file-row", FileRow);
