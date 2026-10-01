export const HIGHLIGHT_BASE_CLASS =
	'yamabiko-divi-gutenberg-elements-highlight';

export const HIGHLIGHT_COLORS = [
	{ id: 'orange', label: 'Orange' },
	{ id: 'yellow', label: 'Yellow' },
	{ id: 'green', label: 'Green' },
	{ id: 'blue', label: 'Blue' },
] as const;

export type HighlightColor = ( typeof HIGHLIGHT_COLORS )[ number ][ 'id' ];

export const DEFAULT_HIGHLIGHT_COLOR: HighlightColor = 'yellow';

export const getHighlightClassName = ( color: HighlightColor ): string =>
	`${ HIGHLIGHT_BASE_CLASS } ${ HIGHLIGHT_BASE_CLASS }--${ color }`;
