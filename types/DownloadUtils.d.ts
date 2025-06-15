declare module "resource://gre/modules/DownloadUtils.sys.mjs" {
	export const DownloadUtils: {
		/** @returns [convertedBytes, units] */
		convertByteUnits(bytes: number): [number, string];
	};
}
