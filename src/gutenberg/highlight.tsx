import {
	DEFAULT_HIGHLIGHT_COLOR,
	getHighlightClassName,
	HIGHLIGHT_COLORS,
	type HighlightColor,
} from '@/highlight/definition';

type RichTextValue = {
	start?: number;
	end?: number;
};

type RichTextFormat = {
	type: string;
	attributes?: Record< string, string >;
};

type HighlightEditProps = {
	isActive: boolean;
	value: RichTextValue;
	onChange: ( value: RichTextValue ) => void;
};

type WordPressRuntime = {
	blockEditor: {
		RichTextToolbarButton: ( props: Record< string, unknown > ) => unknown;
	};
	components: {
		Button: ( props: Record< string, unknown > ) => unknown;
		Dropdown: ( props: Record< string, unknown > ) => unknown;
		Flex: ( props: Record< string, unknown > ) => unknown;
	};
	element: {
		createElement: (
			type: unknown,
			props: Record< string, unknown > | null,
			...children: unknown[]
		) => unknown;
	};
	i18n: {
		__: ( text: string, domain: string ) => string;
	};
	richText: {
		applyFormat: ( value: RichTextValue, format: RichTextFormat ) => RichTextValue;
		getActiveFormat: ( value: RichTextValue, formatType: string ) => RichTextFormat | undefined;
		registerFormatType: ( name: string, settings: Record< string, unknown > ) => void;
		removeFormat: ( value: RichTextValue, formatType: string ) => RichTextValue;
	};
};

declare global {
	interface Window {
		wp: WordPressRuntime;
	}
}

const FORMAT_NAME = 'yamabiko-divi-gutenberg-elements/highlight';
const TEXT_DOMAIN = 'yamabiko-divi-gutenberg-elements';

const { blockEditor, components, element, i18n, richText } = window.wp;
const { RichTextToolbarButton } = blockEditor;
const { Button, Dropdown, Flex } = components;
const { createElement } = element;
const { __ } = i18n;
const { applyFormat, getActiveFormat, registerFormatType, removeFormat } = richText;

const getColorLabel = ( color: HighlightColor ): string => {
	switch ( color ) {
		case 'orange':
			return __( 'Orange', TEXT_DOMAIN );
		case 'green':
			return __( 'Green', TEXT_DOMAIN );
		case 'blue':
			return __( 'Blue', TEXT_DOMAIN );
		case 'yellow':
		default:
			return __( 'Yellow', TEXT_DOMAIN );
	}
};

const getColorFromFormat = ( format: RichTextFormat | undefined ): HighlightColor | undefined => {
	const className = format?.attributes?.className;

	return HIGHLIGHT_COLORS.find(
		( color ) => className?.includes( `yamabiko-divi-gutenberg-elements-highlight--${ color.id }` )
	)?.id;
};

const HighlightEdit = ( { isActive, value, onChange }: HighlightEditProps ): unknown => {
	const activeColor = getColorFromFormat( getActiveFormat( value, FORMAT_NAME ) );

	const applyColor = ( color: HighlightColor ): void => {
		const withoutHighlight = removeFormat( value, FORMAT_NAME );

		onChange(
			applyFormat( withoutHighlight, {
				type: FORMAT_NAME,
				attributes: {
					className: getHighlightClassName( color ),
				},
			} )
		);
	};

	return createElement( Dropdown, {
		popoverProps: { placement: 'bottom-start' },
		renderToggle: ( { isOpen, onToggle }: { isOpen: boolean; onToggle: () => void } ) =>
			createElement( RichTextToolbarButton, {
				icon: 'edit',
				isActive,
				title: __( 'Highlight', TEXT_DOMAIN ),
				onClick: onToggle,
				'aria-expanded': isOpen,
			} ),
		renderContent: ( { onClose }: { onClose: () => void } ) =>
			createElement(
				Flex,
				{ direction: 'column', gap: 1 },
				...HIGHLIGHT_COLORS.map( ( color ) => {
					const label = getColorLabel( color.id );

					return createElement(
						Button,
						{
							key: color.id,
							variant: activeColor === color.id ? 'primary' : 'secondary',
							onClick: () => {
								applyColor( color.id );
								onClose();
							},
							'aria-label': label,
						},
						label
					);
				} ),
				isActive &&
					createElement(
						Button,
						{
							isDestructive: true,
							variant: 'tertiary',
							onClick: () => {
								onChange( removeFormat( value, FORMAT_NAME ) );
								onClose();
							},
						},
						__( 'Remove highlight', TEXT_DOMAIN )
					)
			),
	} );
};

registerFormatType( FORMAT_NAME, {
	title: __( 'Highlight', TEXT_DOMAIN ),
	tagName: 'mark',
	attributes: {
		className: 'class',
	},
	edit: HighlightEdit,
	defaultAttributes: {
		className: getHighlightClassName( DEFAULT_HIGHLIGHT_COLOR ),
	},
} );
