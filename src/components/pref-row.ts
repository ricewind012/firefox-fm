import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import * as UC_API from "chrome://userchromejs/content/uc_api.sys.mjs";

const { PREF_BOOL, PREF_INT, PREF_STRING } = Services.prefs;

@customElement("pref-row")
class PrefRow extends LitElement {
	@property({ type: String }) label = "";
	@property({ type: String }) description = "";
	@property({ type: String }) pref = "";
	@property({ type: Number }) type = -1;

	buildOnChange(pref: string, type: number) {
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
					<input-label label=${this.label} @change=${onChange}></input-label>
				`;
		}
	}
}
