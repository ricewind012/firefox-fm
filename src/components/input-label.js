import { html } from "chrome://global/content/vendor/lit.all.mjs";
import { MozLitElement } from "chrome://global/content/lit-utils.mjs";

import { BASE_URL } from "../consts.js";

class InputLabel extends MozLitElement {
	static properties = {
		label: { type: String },
	};

	onChange(ev) {
		this.value = ev.target.value;
		this.dispatchOnUpdateComplete(new CustomEvent("change"));
	}

	render() {
		return html`
			<link
				rel="stylesheet"
				href="${BASE_URL}/components/input-label.css"
			/>

			<label for="textbox">${this.label}</label>
			<input
				id="textbox"
				@input=${this.onChange}
			/>
		`;
	}
}

customElements.define("input-label", InputLabel);
