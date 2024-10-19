import { html } from "chrome://global/content/vendor/lit.all.mjs";
import { ViewPage } from "chrome://browser/content/firefoxview/viewpage.mjs";

import { BASE_URL } from "../consts.js";
import { getPathForName, newFile } from "../utils/file.js";
import { PREF_DISPLAY_DIRS_FIRST } from "../prefs.js";

export class ViewDir extends ViewPage {
	static observedAttributes = [ViewPage.observedAttributes, "path"];

	constructor() {
		super();
		this.name = this.getAttribute("name");
		this.changePath();
	}

	/**
	 * @param {string} path Dir path.
	 */
	changePath(path) {
		this.dirPath = path || getPathForName(this.name);
		/** @todo Naming this `this.dir` makes it...undefined ? */
		this.pDir = newFile(this.dirPath);
		/** @type nsIFile[] */
		this.files = [...this.pDir.directoryEntries];

		this.setAttribute("path", this.dirPath);
	}

	/**
	 * @todo Maybe there is a better way for the first condition
	 */
	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue === newValue) {
			return;
		}

		super.attributeChangedCallback(name, oldValue, newValue);
		this.changePath(newValue);
		this.requestUpdate();
	}

	/**
	 * @param {Element} target
	 */
	selectRow(target) {
		target.setAttribute("selected", "");
		this.selectedRow?.removeAttribute("selected");
		this.selectedRow = target;
	}

	headerTemplate() {
		return html`
			<link
				rel="stylesheet"
				href="chrome://browser/content/firefoxview/firefoxview.css"
			/>

			<path-header
				class="sticky-container bottom-fade"
				.path=${this.dirPath}
			></path-header>
		`;
	}

	rowsTemplate() {
		const files = Services.prefs.getBoolPref(PREF_DISPLAY_DIRS_FIRST)
			? [
					...this.files.filter((e) => e.isDirectory()),
					...this.files.filter((e) => !e.isDirectory()),
				]
			: this.files;

		return files.map(
			(e) => html`
				<file-row
					.dir=${this.dirPath}
					.file=${e}
					@click=${(ev) => this.selectRow(ev.target)}
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

			${this.headerTemplate()}
			${this.rowsTemplate()}
		`;
	}
}

customElements.define("view-dir", ViewDir);
