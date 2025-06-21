import { html } from "lit";
import { customElement, property } from "lit/decorators.js";

import * as UC_API from "chrome://userchromejs/content/uc_api.sys.mjs";

import { type Pref, prefs } from "@/shared/prefs";
import { CBaseElement } from "@/utils/lit";
import type { ClickEvent } from "@/utils/types";

import { CBaseTab } from "./base";

declare global {
	interface HTMLElementTagNameMap {
		"fm-tab-settings": CSettingsTab;
		"pref-group": CPrefGroup;
		"pref-row": CPrefRow;
	}
}

const { PREF_BOOL, PREF_INT, PREF_STRING } = Services.prefs;

@customElement("pref-group")
class CPrefGroup extends CBaseElement {
	@property({ type: String }) description = "";
	@property({ type: String }) label = "";

	override render() {
		const { description, label } = this;

		return html`
			<pref-group-header>
				<life-text>${label}</life-text>
				<life-text>${description}</life-text>
			</pref-group-header>
		`;
	}
}

@customElement("pref-row")
class CPrefRow extends CBaseElement {
	@property({ type: Object }) pref: Pref;

	ControlTemplate() {
		const { pref } = this;
		const { value } = UC_API.Prefs.get(pref.name);

		switch (pref.type) {
			case PREF_BOOL:
				return html`
					<input type="checkbox" ?checked=${value} @change=${this.OnChange} />
				`;

			case PREF_INT:
			case PREF_STRING:
				return html`
					<input @input=${this.OnChange} />
				`;
		}
	}

	OnChange(ev: ClickEvent<HTMLInputElement>) {
		console.log("VALUE FOR %o IS %o", ev.target, ev.target.value);
	}

	override render() {
		const { pref } = this;

		return html`
			<life-text>${pref.label}</life-text>
			<life-text>${pref.description}</life-text>
			${this.ControlTemplate()}
		`;
	}
}

@customElement("fm-tab-settings")
export class CSettingsTab extends CBaseTab {
	OptionsTemplate() {
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

	override render() {
		return html`
			${this.OptionsTemplate()}
		`;
	}
}
