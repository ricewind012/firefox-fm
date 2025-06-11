import { LitElement } from "lit";

export class CBaseElement extends LitElement {
	protected createRenderRoot(): HTMLElement | DocumentFragment {
		return this;
	}
}
