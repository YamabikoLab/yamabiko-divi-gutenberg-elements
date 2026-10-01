import {
	getHighlightClassName,
	HIGHLIGHT_COLORS,
	type HighlightColor,
} from '@/highlight/definition';

type TinyMceBookmark = unknown;

type TinyMceEditor = {
	formatter: {
		apply: ( name: string ) => void;
		register: (
			name: string,
			definition: {
				inline: string;
				classes: string[];
			}
		) => void;
		remove: ( name: string ) => void;
	};
	selection: {
		getBookmark: ( type?: number, normalized?: boolean ) => TinyMceBookmark;
		moveToBookmark: ( bookmark: TinyMceBookmark ) => void;
	};
	undoManager: {
		transact: ( callback: () => void ) => void;
	};
	getContainer: () => HTMLElement;
	on: ( event: string, callback: () => void ) => void;
};

type DiviWindow = Window & {
	tinymce?: {
		editors: TinyMceEditor[];
	};
	wp?: {
		i18n?: {
			__: ( text: string, domain: string ) => string;
		};
	};
};

const CONTROL_ATTRIBUTE = 'data-yamabiko-divi-gutenberg-elements-highlight';
const FORMAT_PREFIX = 'yamabiko_divi_gutenberg_elements_highlight_';
const connectedEditors = new WeakSet< TinyMceEditor >();
const bookmarks = new WeakMap< TinyMceEditor, TinyMceBookmark >();
const diviWindow = window as DiviWindow;

const getColorLabel = ( color: HighlightColor ): string => {
	const __ = diviWindow.wp?.i18n?.__;

	switch ( color ) {
		case 'orange':
			return __?.( 'Orange', 'yamabiko-divi-gutenberg-elements' ) ?? 'Orange';
		case 'green':
			return __?.( 'Green', 'yamabiko-divi-gutenberg-elements' ) ?? 'Green';
		case 'blue':
			return __?.( 'Blue', 'yamabiko-divi-gutenberg-elements' ) ?? 'Blue';
		case 'yellow':
		default:
			return __?.( 'Yellow', 'yamabiko-divi-gutenberg-elements' ) ?? 'Yellow';
	}
};

const formatName = ( color: HighlightColor ): string => `${ FORMAT_PREFIX }${ color }`;

const registerFormats = ( editor: TinyMceEditor ): void => {
	for ( const color of HIGHLIGHT_COLORS ) {
		editor.formatter.register( formatName( color.id ), {
			inline: 'mark',
			classes: getHighlightClassName( color.id ).split( ' ' ),
		} );
	}
};

const restoreSelection = ( editor: TinyMceEditor ): void => {
	const bookmark = bookmarks.get( editor );

	if ( bookmark !== undefined ) {
		editor.selection.moveToBookmark( bookmark );
	}
};

const removeHighlight = ( editor: TinyMceEditor ): void => {
	for ( const color of HIGHLIGHT_COLORS ) {
		editor.formatter.remove( formatName( color.id ) );
	}
};

const applyHighlight = ( editor: TinyMceEditor, color: HighlightColor ): void => {
	editor.undoManager.transact( () => {
		restoreSelection( editor );
		removeHighlight( editor );
		editor.formatter.apply( formatName( color ) );
	} );
};

const clearHighlight = ( editor: TinyMceEditor ): void => {
	editor.undoManager.transact( () => {
		restoreSelection( editor );
		removeHighlight( editor );
	} );
};

const createMenu = ( editor: TinyMceEditor, anchor: HTMLElement ): HTMLDivElement => {
	const menu = document.createElement( 'div' );
	const rect = anchor.getBoundingClientRect();

	menu.setAttribute( CONTROL_ATTRIBUTE, 'menu' );
	menu.setAttribute( 'role', 'menu' );
	menu.style.position = 'fixed';
	menu.style.zIndex = '100000';
	menu.style.top = `${ rect.bottom + 4 }px`;
	menu.style.left = `${ rect.left }px`;
	menu.style.display = 'flex';
	menu.style.flexDirection = 'column';
	menu.style.gap = '4px';
	menu.style.padding = '8px';
	menu.style.background = '#fff';
	menu.style.border = '1px solid #dcdcde';
	menu.style.boxShadow = '0 2px 8px rgb(0 0 0 / 15%)';

	const close = (): void => menu.remove();

	for ( const color of HIGHLIGHT_COLORS ) {
		const item = document.createElement( 'button' );
		const label = getColorLabel( color.id );

		item.type = 'button';
		item.textContent = label;
		item.setAttribute( 'role', 'menuitem' );
		item.setAttribute( 'aria-label', label );
		item.addEventListener( 'click', () => {
			applyHighlight( editor, color.id );
			close();
		} );
		menu.append( item );
	}

	const clear = document.createElement( 'button' );
	clear.type = 'button';
	clear.textContent =
		diviWindow.wp?.i18n?.__(
			'Remove highlight',
			'yamabiko-divi-gutenberg-elements'
		) ?? 'Remove highlight';
	clear.setAttribute( 'role', 'menuitem' );
	clear.addEventListener( 'click', () => {
		clearHighlight( editor );
		close();
	} );
	menu.append( clear );

	return menu;
};

const addToolbarControl = ( editor: TinyMceEditor ): void => {
	const container = editor.getContainer();
	const toolbar = container.querySelector< HTMLElement >(
		'.tox-toolbar__primary, .mce-toolbar-grp'
	);

	if ( ! toolbar || toolbar.querySelector( `[${ CONTROL_ATTRIBUTE }="button"]` ) ) {
		return;
	}

	const button = document.createElement( 'button' );
	const label =
		diviWindow.wp?.i18n?.__(
			'Highlight',
			'yamabiko-divi-gutenberg-elements'
		) ?? 'Highlight';

	button.type = 'button';
	button.textContent = label;
	button.setAttribute( CONTROL_ATTRIBUTE, 'button' );
	button.setAttribute( 'aria-label', label );
	button.classList.add( 'tox-tbtn' );

	button.addEventListener( 'mousedown', () => {
		bookmarks.set( editor, editor.selection.getBookmark( 2, true ) );
	} );

	button.addEventListener( 'click', () => {
		document
			.querySelectorAll< HTMLElement >( `[${ CONTROL_ATTRIBUTE }="menu"]` )
			.forEach( ( menu ) => menu.remove() );
		document.body.append( createMenu( editor, button ) );
	} );

	toolbar.append( button );
};

const connectEditor = ( editor: TinyMceEditor ): void => {
	if ( connectedEditors.has( editor ) ) {
		addToolbarControl( editor );
		return;
	}

	registerFormats( editor );
	addToolbarControl( editor );
	connectedEditors.add( editor );
	editor.on( 'remove', () => {
		bookmarks.delete( editor );
	} );
};

const connectEditors = (): void => {
	diviWindow.tinymce?.editors.forEach( connectEditor );
};

connectEditors();

const observer = new MutationObserver( connectEditors );
observer.observe( document.documentElement, {
	childList: true,
	subtree: true,
} );

window.addEventListener(
	'beforeunload',
	() => {
		observer.disconnect();
	},
	{ once: true }
);
