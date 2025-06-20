declare module "resource:///modules/PanelMultiView.sys.mjs" {
	export const PanelMultiView: {
		/**
		 * @see https://github.com/mozilla/gecko-dev/blob/master/browser/components/customizableui/PanelMultiView.sys.mjs#L467
		 */
		openPopup(
			// WHAT is this argument and why is it not mentioned anywhere
			panel: XULPopupElement,
			anchor: Node,
			options: StringOrOpenPopupOptions,
			...args: string[]
		): Promise<boolean>;
	};
}
