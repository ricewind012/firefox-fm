import type { LitElement } from "../node_modules/lit-element/lit-element";

declare module "chrome://global/content/lit-utils.mjs" {
	export class MozLitELement extends LitElement {}
}
