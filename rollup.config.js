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

/** @type {import("rollup").RollupOptions} */
export default {
	external: /^(chrome|moz-src|resource):\/\//,
	input: Object.fromEntries(
		globSync("src/**/*.ts")
			.filter((e) => !e.startsWith("src/userscripts"))
			.map((file) => [
				// This removes `src/` as well as the file extension from each
				// file, so e.g. src/nested/foo.js becomes nested/foo
				path.relative(
					"src",
					file.slice(0, file.length - path.extname(file).length),
				),
				// This expands the relative paths to absolute paths, so e.g.
				// src/nested/foo becomes /project/src/nested/foo.js
				fileURLToPath(new URL(file, import.meta.url)),
			]),
	),
	output: {
		dir: "dist",
		entryFileNames: "[name].js",
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
