import { property } from "lit/decorators.js";

import { CBaseElement } from "@/utils/lit";

import type { CTabsContainer } from "../content";

export class CBaseTab extends CBaseElement {
	@property({ attribute: true, type: String }) name = "";

	m_elTabs: CTabsContainer;

	override connectedCallback() {
		super.connectedCallback();
		this.m_elTabs = this.parentElement as CTabsContainer;
	}
}
