import { html } from "lit";
import { customElement, property } from "lit/decorators.js";

import * as UC_API from "chrome://userchromejs/content/uc_api.sys.mjs";

import { CBaseElement } from "../../utils/lit";
import type { ClickEvent } from "../../utils/types";

import { CBaseTab } from "./base";
import { type Pref, prefs } from "../../prefs";

declare global {
	interface HTMLElementTagNameMap {
		"fm-tab-settings": SettingsTab;
		"pref-group": PrefGroup;
		"pref-row": PrefRow;
	}
}

const { PREF_BOOL, PREF_INT, PREF_STRING } = Services.prefs;

@customElement("pref-group")
class PrefGroup extends CBaseElement {
	@property({ type: String }) description = "";
	@property({ type: String }) label = "";

	render() {
		const { description, label } = this;

		return html`
			<pref-group-header>
				<fm-text>${label}</fm-text>
				<fm-text>${description}</fm-text>
			</pref-group-header>
		`;
	}
}

@customElement("pref-row")
class PrefRow extends CBaseElement {
	@property({ type: Object }) pref: Pref;

	controlTemplate() {
		const { pref } = this;
		const { value } = UC_API.Prefs.get(pref.name);

		switch (pref.type) {
			case PREF_BOOL:
				return html`
					<input type="checkbox" ?checked=${value} @change=${this.onChange} />
				`;

			case PREF_INT:
			case PREF_STRING:
				return html`
					<input @input=${this.onChange} />
				`;
		}
	}

	onChange(ev: ClickEvent<HTMLInputElement>) {
		console.log("VALUE FOR %o IS %o", ev.target, ev.target.value);
	}

	render() {
		const { pref } = this;

		return html`
			<fm-text>${pref.label}</fm-text>
			<fm-text>${pref.description}</fm-text>
			${this.controlTemplate()}
		`;
	}
}

@customElement("fm-tab-settings")
export class SettingsTab extends CBaseTab {
	optionsTemplate() {
		return prefs.map(
			({ label, description, opts }) => html`
				<pref-group label=${label} description=${description}>
					${opts.map(
						(pref) => html`
							<pref-row .pref=${pref}></pref-row>
						`,
					)}
				</pref-group>
			`,
		);
	}

	render() {
		return html`
			${this.optionsTemplate()}
		`;
	}
}
