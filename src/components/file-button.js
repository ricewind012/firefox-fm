import { html } from "chrome://global/content/vendor/lit.all.mjs";
import { MozLitElement } from "chrome://global/content/lit-utils.mjs";

import { newFile } from "../file-utils.js";

class FileButton extends MozLitElement {
	/**
	 * @todo why is this bullshit necessary
	 */
	get file() {
		if (!this._file) {
			this._file = newFile(this.path);
		}
		return this._file;
	}

	connectedCallback() {
		super.connectedCallback();
		this.path = this.getAttribute("path");
	}

	onButtonClick() {
		this.file.launch();
	}

	render() {
		return html`
			<moz-button
				@click=${this.onButtonClick}
			>
				${PathUtils.filename(this.path)}
			</moz-button>
		`;
	}
}

customElements.define("file-button", FileButton);
