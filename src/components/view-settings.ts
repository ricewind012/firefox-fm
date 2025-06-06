import { html } from "chrome://global/content/vendor/lit.all.mjs";
import { customElement } from "lit/decorators.js";
import { ViewPage } from "chrome://browser/content/firefoxview/viewpage.mjs";

import { BASE_URL } from "../consts.js";
import { prefs } from "../prefs.js";

@customElement("view-settings")
export class ViewSettings extends ViewPage {
	optionsTemplate() {
		return prefs.map(
			({ label, description, opts }) => html`
				<moz-fieldset label=${label} description=${description}>
					${opts.map(
						({ label, description, pref, type }) => html`
							<pref-row
								.label=${label}
								.description=${description}
								.pref=${pref}
								.type=${type}
							></pref-row>
						`,
					)}
				</moz-fieldset>
			`,
		);
	}

	render() {
		return html`
			<link rel="stylesheet" href="${BASE_URL}/components/view-settings.css" />

			${this.optionsTemplate()}
		`;
	}
}
