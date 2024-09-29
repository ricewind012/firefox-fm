import { html } from "chrome://global/content/vendor/lit.all.mjs";
import { MozLitElement } from "chrome://global/content/lit-utils.mjs";

import { BASE_URL } from "../consts.js";
import { getFileExtension } from "../file-utils.js";

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

class FileRow extends MozLitElement {
	static properties = {
		file: { type: Object },
		dir: { type: String },
	};

	static queries = {
		menu: "panel-list",
	};

	connectedCallback() {
		super.connectedCallback();
		//this.file = newFile(this.path);
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
		const { path } = this.file;
		const basename = PathUtils.filename(path);
		const extension = getFileExtension(path);
		const icon = this.file.isFile()
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
