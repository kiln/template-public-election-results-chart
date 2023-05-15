/* eslint-env node */

import nodeResolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";

// We have two different modes for our template bundle: "development" and
// "production". We use development mode when we want the bundle to be generated
// quickly, often disabling slower transforms like babel and terser. Production
// mode is for published templates, and for testing, where it's acceptable for
// slower build speeds in exchange for a smaller and more optimized final file.
//
// Running `flourish publish` will automatically set `NODE_ENV=production` as an
// environment variable when running your build script, so this is a good way to
// switch between development/production mode while using a single configuration
// file.
const is_production = process.env.NODE_ENV === "production" || !!process.env.CI;

/** @type {Partial<import("rollup").RollupOptions>} */
export default {
	input: "src/index.js",
	output: {
		file: "template.js",
		name: "template",
		sourcemap: true,
		format: "iife"
	},
	plugins: [
		// The node-resolve plugin replicates Node.js's module resolution algorithm,
		// meaning that it allows you to import packages that have been installed
		// into `node_modules` using a package manager like npm, pnpm or yarn.
		nodeResolve(),
		// As a final step, terser minifies the template JavaScript. This can slow
		// down the build considerably, and so it's only enabled in production.
		is_production && terser(),
	],
	onwarn: function onwarn(warning, warn) {
		// Cyclic dependencies are allowed in ES6, and such imports occur in many d3
		// components, so suppress those rollup warnings.
		if (warning.code === "CIRCULAR_DEPENDENCY") return;
		// Forces rollup to fail if it's unable to resolve an import.
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
