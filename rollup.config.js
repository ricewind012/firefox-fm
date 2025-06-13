import del from "rollup-plugin-delete";
import typescript from "@rollup/plugin-typescript";
import nodeResolve from "@rollup/plugin-node-resolve";

/** @type {import("rollup").RollupOptions} */
export default {
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
