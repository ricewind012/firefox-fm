import { property } from "lit/decorators.js";

import { CBaseElement } from "@utils/lit";

import type { TabsContainer } from "../content";

export class CBaseTab extends CBaseElement {
	@property({ type: String, attribute: true }) name = "";

	m_elTabs: TabsContainer;

	connectedCallback() {
		super.connectedCallback();
		this.m_elTabs = this.parentElement as TabsContainer;
	}
}
