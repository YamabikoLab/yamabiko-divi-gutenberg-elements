<?php
/**
 * Plugin Name: Yamabiko Divi Gutenberg Elements
 * Plugin URI: https://github.com/YamabikoLab/yamabiko-divi-gutenberg-elements
 * Description: Shared editor elements and tools for Gutenberg and Divi 5.
 * Version: 0.1.0
 * Requires at least: 6.8
 * Requires PHP: 8.1
 * Author: YamabikoLab
 * Author URI: https://yamabikolab.com/
 * License: GPL-2.0-or-later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: yamabiko-divi-gutenberg-elements
 *
 * @package YamabikoDiviGutenbergElements
 */

declare(strict_types=1);

namespace YamabikoLab\DiviGutenbergElements;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

const PLUGIN_VERSION = '0.1.0';

function enqueue_highlight_style(): void {
	wp_enqueue_style(
		'yamabiko-divi-gutenberg-elements-highlight',
		plugins_url( 'src/highlight/highlight.css', __FILE__ ),
		array(),
		PLUGIN_VERSION
	);
}
add_action( 'enqueue_block_assets', __NAMESPACE__ . '\\enqueue_highlight_style' );
add_action( 'wp_enqueue_scripts', __NAMESPACE__ . '\\enqueue_highlight_style' );

function enqueue_gutenberg_highlight(): void {
	$script_path = plugin_dir_path( __FILE__ ) . 'build/gutenberg/highlight.js';

	if ( ! is_readable( $script_path ) ) {
		return;
	}

	wp_enqueue_script(
		'yamabiko-divi-gutenberg-elements-gutenberg-highlight',
		plugins_url( 'build/gutenberg/highlight.js', __FILE__ ),
		array( 'wp-block-editor', 'wp-components', 'wp-element', 'wp-i18n', 'wp-rich-text' ),
		(string) filemtime( $script_path ),
		true
	);

	wp_set_script_translations(
		'yamabiko-divi-gutenberg-elements-gutenberg-highlight',
		'yamabiko-divi-gutenberg-elements'
	);
}
add_action(
	'enqueue_block_editor_assets',
	__NAMESPACE__ . '\\enqueue_gutenberg_highlight'
);

function is_divi_visual_builder_request(): bool {
	$visual_builder = filter_input( INPUT_GET, 'et_fb', FILTER_SANITIZE_FULL_SPECIAL_CHARS );

	return '1' === $visual_builder;
}

function enqueue_divi_highlight(): void {
	if ( ! is_divi_visual_builder_request() ) {
		return;
	}

	$script_path = plugin_dir_path( __FILE__ ) . 'build/divi/highlight.js';

	if ( ! is_readable( $script_path ) ) {
		return;
	}

	wp_enqueue_script(
		'yamabiko-divi-gutenberg-elements-divi-highlight',
		plugins_url( 'build/divi/highlight.js', __FILE__ ),
		array( 'wp-i18n' ),
		(string) filemtime( $script_path ),
		true
	);

	wp_set_script_translations(
		'yamabiko-divi-gutenberg-elements-divi-highlight',
		'yamabiko-divi-gutenberg-elements'
	);
}
add_action( 'wp_enqueue_scripts', __NAMESPACE__ . '\\enqueue_divi_highlight' );
