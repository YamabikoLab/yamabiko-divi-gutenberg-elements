const path = require( 'path' );
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );

const createConfig = ( name, entry, outputPath ) => ( {
	...defaultConfig,
	name,
	entry,
	output: {
		...defaultConfig.output,
		path: path.resolve( __dirname, outputPath ),
		filename: 'highlight.js',
		clean: true,
	},
	resolve: {
		...defaultConfig.resolve,
		alias: {
			...( defaultConfig.resolve?.alias ?? {} ),
			'@': path.resolve( __dirname, 'src' ),
		},
	},
} );

module.exports = [
	createConfig(
		'gutenberg',
		'./src/gutenberg/highlight.tsx',
		'build/gutenberg'
	),
	createConfig( 'divi', './src/divi/highlight.ts', 'build/divi' ),
];
