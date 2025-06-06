import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

import { BASE_URL } from "../consts.js";

@customElement("input-label")
class InputLabel extends LitElement {
	@property({ type: String }) label = "";
	@property({ type: String }) value = "";

	onChange(ev) {
		this.value = ev.target.value;
	}

	render() {
		return html`
			<link rel="stylesheet" href="${BASE_URL}/components/input-label.css" />

			<label for="textbox">${this.label}</label>
			<input id="textbox" @input=${this.onChange} />
		`;
	}
}
