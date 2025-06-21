declare global {
	interface HTMLElement {
		connectedCallback(): void;
	}
}

export type App_t = "fm";

export interface ClickEvent<T extends Node = Element>
	extends Omit<Event, "target"> {
	target: T;
}
