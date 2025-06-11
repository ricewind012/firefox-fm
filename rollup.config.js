import { globSync } from "glob";
import path from "node:path";
import { fileURLToPath } from "node:url";

import del from "rollup-plugin-delete";
import typescript from "@rollup/plugin-typescript";
import nodeResolve from "@rollup/plugin-node-resolve";

/** @type {import("rollup").RollupOptions} */
export default {
	/*
	input: Object.fromEntries(
		globSync("src/app/*.ts").map((file) => [
			// This removes `src/` as well as the file extension from each
			// file, so e.g. src/nested/foo.js becomes nested/foo
			path.relative(
				"src",
				file.slice(0, file.length - path.extname(file).length)
			),
			// This expands the relative paths to absolute paths, so e.g.
			// src/nested/foo becomes /project/src/nested/foo.js
			fileURLToPath(new URL(file, import.meta.url)),
		])
	),
	*/
	input: "src/page/fm.ts",
	output: {
		dir: "dist",
	},
	// TODO: maybe use firefox import
	//external: ["lit", "lit/decorators"],
	plugins: [
		del({ targets: ["dist"] }),
		typescript(),
		nodeResolve({
			exportConditions: ["development"],
		}),
	],
};
