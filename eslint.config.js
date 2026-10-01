/**
 * WordPress dependencies
 */
const wordpress = require( '@wordpress/eslint-plugin' );

module.exports = [
	{
		ignores: [ 'build/**', 'node_modules/**', 'vendor/**' ],
	},
	{
		linterOptions: {
			reportUnusedDisableDirectives: 'error',
		},
	},
	...wordpress.configs.recommended,
];
