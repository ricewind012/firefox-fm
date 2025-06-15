/** @type {import("@trivago/prettier-plugin-sort-imports").PluginConfig} */
const sortImportsConfig = {
	importOrder: [
		"^(chrome|moz-src|resource)://",
		"^@(components|shared|utils)/",
		"^[./]",
	],
	importOrderParserPlugins: ["typescript", "decorators"],
	importOrderSeparation: true,
};

/** @type {import("prettier").Config} */
export default {
	...sortImportsConfig,
	htmlWhitespaceSensitivity: "ignore",
	useTabs: true,
	// eslint-plugin-perfectionist sorting was nonsensical no matter what I did,
	// so just use this for now.
	plugins: ["@trivago/prettier-plugin-sort-imports"],
};
