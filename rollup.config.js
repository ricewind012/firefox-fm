/**
 * biome-ignore-all assist/source/organizeImports: special sorting just because:
 *
 * 1. glob/node
 * 2. rollup plugins
 */

import { globSync } from "glob";
import path from "node:path";
import { fileURLToPath } from "node:url";

import del from "rollup-plugin-delete";
import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

/** @see [src/shared/consts]({@link ./src/shared/consts.ts}) */
const APP_LIST = ["base", "fm"];

const input = {};
for (const app of APP_LIST) {
	const entries = globSync(`src/apps/${app}/**/*.ts`).map((file) => [
		// This removes `src/` as well as the file extension from each
		// file, so e.g. src/nested/foo.js becomes nested/foo
		path.relative(
			"src",
			file.slice(0, file.length - path.extname(file).length),
		),
		// This expands the relative paths to absolute paths, so e.g.
		// src/nested/foo becomes /project/src/nested/foo.js
		fileURLToPath(new URL(file, import.meta.url)),
	]);
	Object.assign(input, Object.fromEntries(entries));
}

/** @type {import("rollup").RollupOptions} */
export default {
	external: /^(chrome|moz-src|resource):\/\//,
	input,
	output: {
		dir: "dist",
		entryFileNames: "[name].js",
		manualChunks(id) {
			switch (true) {
				case id.includes("node_modules"):
					return "vendor";
				case id.includes("src/shared"):
					return "shared";
				case id.includes("src/utils"):
					return "utils";
				default:
					return null;
			}
		},
	},
	plugins: [
		del({
			targets: ["dist"],
		}),
		typescript(),
		nodeResolve({
			exportConditions: ["development"],
		}),
	],
};
