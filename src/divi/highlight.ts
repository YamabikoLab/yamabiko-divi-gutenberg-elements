import {
	getHighlightClassName,
	HIGHLIGHT_COLORS,
	type HighlightColor,
} from '@/highlight/definition';

type TinyMceBookmark = unknown;

type TinyMceEditor = {
	formatter: {
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
	execCommand: ( command: string, ui?: boolean, value?: unknown ) => void;
	getContainer: () => HTMLElement;
	getContent: () => string;
	getDoc?: () => Document;
	on: ( event: string, callback: () => void ) => void;
};

type ImmutableInnerContent = {
	getIn?: ( path: string[] ) => unknown;
	setIn?: ( path: string[], value: string ) => unknown;
};

type EditPostSelectors = {
	getModuleAttr?: ( moduleId: string, attrName: string ) => unknown;
	getModuleName?: ( moduleId: string ) => string | undefined;
};

type ModalLibrarySelectors = {
	getModalOwner?: ( modalName: string ) => string | undefined;
};

type EditPostDispatch = {
	editModuleAttribute?: ( params: {
		id: string;
		attrName: string;
		value: unknown;
		subName: string | false;
	} ) => void;
};

type DiviData = {
	select: ( store: 'divi/edit-post' ) => EditPostSelectors;
	select: ( store: 'divi/modal-library' ) => ModalLibrarySelectors;
	dispatch: ( store: 'divi/edit-post' ) => EditPostDispatch;
};

type DiviWindow = Window & {
	divi?: {
		data?: DiviData;
	};
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
const EDITOR_STYLE_ATTRIBUTE =
	'data-yamabiko-divi-gutenberg-elements-highlight-style';
const HIGHLIGHT_STYLE_ID = 'yamabiko-divi-gutenberg-elements-highlight-css';
const FORMAT_PREFIX = 'yamabiko_divi_gutenberg_elements_highlight_';
const connectedEditors = new WeakSet< TinyMceEditor >();
const bookmarks = new WeakMap< TinyMceEditor, TinyMceBookmark >();
const diviWindow = window as DiviWindow;

const getColorLabel = ( color: HighlightColor ): string => {
	const __ = diviWindow.wp?.i18n?.__;

	switch ( color ) {
		case 'orange':
			return (
				__?.( 'Orange', 'yamabiko-divi-gutenberg-elements' ) ?? 'Orange'
			);
		case 'green':
			return (
				__?.( 'Green', 'yamabiko-divi-gutenberg-elements' ) ?? 'Green'
			);
		case 'blue':
			return __?.( 'Blue', 'yamabiko-divi-gutenberg-elements' ) ?? 'Blue';
		case 'yellow':
		default:
			return (
				__?.( 'Yellow', 'yamabiko-divi-gutenberg-elements' ) ?? 'Yellow'
			);
	}
};

const formatName = ( color: HighlightColor ): string =>
	`${ FORMAT_PREFIX }${ color }`;

const registerFormats = ( editor: TinyMceEditor ): void => {
	for ( const color of HIGHLIGHT_COLORS ) {
		editor.formatter.register( formatName( color.id ), {
			inline: 'mark',
			classes: getHighlightClassName( color.id ).split( ' ' ),
		} );
	}
};

const ensureEditorStyle = ( editor: TinyMceEditor ): void => {
	const sourceStyle = document.getElementById( HIGHLIGHT_STYLE_ID );
	const editorDocument = editor.getDoc?.();

	if (
		! ( sourceStyle instanceof HTMLLinkElement ) ||
		! editorDocument?.head ||
		editorDocument.head.querySelector( `[${ EDITOR_STYLE_ATTRIBUTE }]` )
	) {
		return;
	}

	const editorStyle = sourceStyle.cloneNode( true ) as HTMLLinkElement;
	editorStyle.removeAttribute( 'id' );
	editorStyle.setAttribute( EDITOR_STYLE_ATTRIBUTE, '' );
	editorDocument.head.append( editorStyle );
};

const restoreSelection = ( editor: TinyMceEditor ): void => {
	const bookmark = bookmarks.get( editor );

	if ( bookmark !== undefined ) {
		editor.selection.moveToBookmark( bookmark );
	}
};

const getEditedTextModuleId = (): string | undefined => {
	const data = diviWindow.divi?.data;

	if ( ! data ) {
		return undefined;
	}

	const moduleId = data
		.select( 'divi/modal-library' )
		.getModalOwner?.( 'divi/module' );

	if ( ! moduleId ) {
		return undefined;
	}

	const moduleName = data
		.select( 'divi/edit-post' )
		.getModuleName?.( moduleId );

	return moduleName === 'divi/text' ? moduleId : undefined;
};

const syncDiviModuleContent = ( editor: TinyMceEditor ): void => {
	const data = diviWindow.divi?.data;
	const moduleId = getEditedTextModuleId();

	if ( ! data || ! moduleId ) {
		return;
	}

	const html = editor.getContent();
	const selectors = data.select( 'divi/edit-post' );
	const currentValue = selectors.getModuleAttr?.(
		moduleId,
		'content.innerContent'
	) as ImmutableInnerContent | undefined;
	const currentHtml = currentValue?.getIn?.( [ 'desktop', 'value' ] );

	if ( currentHtml === html ) {
		return;
	}

	const dispatch = data.dispatch( 'divi/edit-post' );

	if ( ! dispatch.editModuleAttribute ) {
		return;
	}

	if ( currentValue?.setIn ) {
		dispatch.editModuleAttribute( {
			id: moduleId,
			attrName: 'content.innerContent',
			value: currentValue.setIn( [ 'desktop', 'value' ], html ),
			subName: 'desktop.value',
		} );
		return;
	}

	dispatch.editModuleAttribute( {
		id: moduleId,
		attrName: 'content.innerContent',
		value: {
			desktop: {
				value: html,
			},
		},
		subName: false,
	} );
};

const removeHighlight = ( editor: TinyMceEditor ): void => {
	for ( const color of HIGHLIGHT_COLORS ) {
		editor.formatter.remove( formatName( color.id ) );
	}
};

const applyHighlight = (
	editor: TinyMceEditor,
	color: HighlightColor
): void => {
	editor.undoManager.transact( () => {
		restoreSelection( editor );
		removeHighlight( editor );
		editor.execCommand( 'mceToggleFormat', false, formatName( color ) );
	} );

	syncDiviModuleContent( editor );
};

const clearHighlight = ( editor: TinyMceEditor ): void => {
	editor.undoManager.transact( () => {
		restoreSelection( editor );
		removeHighlight( editor );
	} );

	syncDiviModuleContent( editor );
};

const createMenu = (
	editor: TinyMceEditor,
	anchor: HTMLElement
): HTMLDivElement => {
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

	if (
		! toolbar ||
		toolbar.querySelector( `[${ CONTROL_ATTRIBUTE }="button"]` )
	) {
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
			.querySelectorAll< HTMLElement >(
				`[${ CONTROL_ATTRIBUTE }="menu"]`
			)
			.forEach( ( menu ) => menu.remove() );
		document.body.append( createMenu( editor, button ) );
	} );

	toolbar.append( button );
};

const connectEditor = ( editor: TinyMceEditor ): void => {
	if ( connectedEditors.has( editor ) ) {
		ensureEditorStyle( editor );
		addToolbarControl( editor );
		return;
	}

	registerFormats( editor );
	ensureEditorStyle( editor );
	addToolbarControl( editor );
	connectedEditors.add( editor );
	editor.on( 'init', () => {
		ensureEditorStyle( editor );
	} );
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
