/* eslint-env node */
import nodeResolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";

const is_production = process.env.NODE_ENV === "production" || !!process.env.CI;

export default {
	input: "src/index.js",
	output: {
		file: "template.js",
		name: "template",
		sourcemap: true,
		format: "iife"
	},
	plugins: [
		nodeResolve(),
		is_production && terser(),
	],
	onwarn: function (warning, warn) {
		if (warning.code === "CIRCULAR_DEPENDENCY") return;
		if (warning.code === "UNRESOLVED_IMPORT") {
			throw new Error(
				"Couldn't resolve the dependency " + warning.source +
					" (from " + warning.importer + "): sometimes you can" +
					" fix this with 'npm install', or add '" + warning.source +
					" to 'external'. See: " + warning.url
			);
		}
		warn(warning);
	}
};
