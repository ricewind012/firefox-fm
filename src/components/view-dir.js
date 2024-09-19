import { html } from "chrome://global/content/vendor/lit.all.mjs";
import { ViewPage } from "chrome://browser/content/firefoxview/viewpage.mjs";
import "chrome://global/content/megalist/VirtualizedList.mjs";

import { BASE_URL } from "../consts.js";
import { getPathForName, newFile } from "../file-utils.js";

export class ViewDir extends ViewPage {
	constructor() {
		super();
		this.name = this.getAttribute("name");
		this.dirPath = getPathForName(this.name);
		this.pDir = newFile(this.dirPath);
		/** @type nsIFile[] */
		this.files = [...this.pDir.directoryEntries];
	}

	buttonsTemplate() {
		const files = this.files.map(
			(e) => html`<file-row path=${e.path}></file-row>`,
		);

		// TODO: use virtualized-list when ready(?)
		return html`
			${files}
		`;
	}

	render() {
		return html`
			<link
				rel="stylesheet"
				href="${BASE_URL}/components/view-dir.css"
			/>

			${this.buttonsTemplate()}
		`;
	}
}

customElements.define("view-dir", ViewDir);
