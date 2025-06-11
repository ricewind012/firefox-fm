export interface ClickEvent<T extends Node = Element>
	extends Omit<Event, "target"> {
	target: T;
}
