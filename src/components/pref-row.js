import { html } from "chrome://global/content/vendor/lit.all.mjs";
import { MozLitElement } from "chrome://global/content/lit-utils.mjs";
import * as UC_API from "chrome://userchromejs/content/uc_api.sys.mjs";

const { PREF_BOOL, PREF_INT, PREF_STRING } = Services.prefs;

class PrefRow extends MozLitElement {
	static properties = {
		label: { type: String },
		description: { type: String },
		pref: { type: String },
		type: { type: Number },
	};

	buildOnChange(pref, type) {
		const key = (() => {
			switch (type) {
				case PREF_BOOL:
					return "pressed";
				case PREF_INT:
				case PREF_STRING:
					return "value";
			}
		})();

		return (ev) => {
			UC_API.Prefs.set(pref, ev.originalTarget[key]);
		};
	}

	render() {
		const value = UC_API.Prefs.get(this.pref);
		const onChange = this.buildOnChange(this.pref, this.type);

		switch (this.type) {
			case PREF_BOOL:
				return html`
					<moz-toggle
						pressed=${value}
						label=${this.label}
						description=${this.description}
						@toggle=${onChange}
					></moz-toggle>
				`;

			case PREF_INT:
			case PREF_STRING:
				return html`
					<input-label
						label=${this.label}
						@change=${onChange}
					></input-label>
				`;
		}
	}
}

customElements.define("pref-row", PrefRow);
