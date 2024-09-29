import { html } from "chrome://global/content/vendor/lit.all.mjs";
import { ViewPage } from "chrome://browser/content/firefoxview/viewpage.mjs";

import { BASE_URL } from "../consts.js";
import { getPathForName, newFile } from "../file-utils.js";

export class ViewDir extends ViewPage {
	constructor() {
		super();
		this.name = this.getAttribute("name");
		this.dirPath = getPathForName(this.name);
		/** @todo Naming this `this.dir` makes it...undefined ? */
		this.pDir = newFile(this.dirPath);
		/** @type nsIFile[] */
		this.files = [...this.pDir.directoryEntries];
	}

	buttonsTemplate() {
		return this.files.map(
			(e) => html`
				<file-row
					.dir=${this.dirPath}
					.file=${e}
				></file-row>
			`,
		);
	}

	/**
	 * @todo use virtualized-list when ready(?)
	 */
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
