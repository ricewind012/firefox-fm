import { LitElement } from "lit";

export class CBaseElement extends LitElement {
	protected override createRenderRoot(): HTMLElement | DocumentFragment {
		return this;
	}
}
