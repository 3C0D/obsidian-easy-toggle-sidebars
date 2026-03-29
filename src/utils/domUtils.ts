import { CSS_SELECTORS, UI_CONSTANTS } from '../constants/index.ts';

/**
 * Utilities for DOM zone detection and UI interactions
 */
export class ZoneDetector {
	/**
	 * Check if element is in a reveal zone
	 */
	static isRevealZone(element: HTMLElement): boolean {
		return !!(
			element.closest(CSS_SELECTORS.VIEW_HEADER_TITLE_CONTAINER) ||
			element.closest(CSS_SELECTORS.VIEW_HEADER_TITLE)
		);
	}

	/**
	 * Check if element is in a double-click edge zone
	 */
	static isDoubleClickZone(element: HTMLElement, evt: MouseEvent): boolean {
		const isScroller = element.closest(CSS_SELECTORS.CM_SCROLLER);
		if (!isScroller) return false;

		const rect = isScroller.getBoundingClientRect();
		const offsetX = evt.clientX - rect.left;
		return (
			offsetX < UI_CONSTANTS.EDGE_ZONE_WIDTH ||
			offsetX > rect.width - UI_CONSTANTS.EDGE_ZONE_WIDTH
		);
	}

	/**
	 * Check if element is in the ribbon zone
	 */
	static isRibbonZone(element: HTMLElement): boolean {
		return !!element.closest(CSS_SELECTORS.WORKSPACE_RIBBON);
	}

	/**
	 * Check if element is in the main editor zone
	 */
	static isEditorZone(element: HTMLElement): boolean {
		return !!element.closest(CSS_SELECTORS.MOD_ROOT_VIEW_CONTENT);
	}

	/**
	 * Check if element is in the left split zone
	 */
	static isLeftSplitZone(element: HTMLElement): boolean {
		return !!element.closest(CSS_SELECTORS.MOD_LEFT_SPLIT);
	}

	/**
	 * Check if element is in the editor content zone
	 */
	static isEditorContent(element: HTMLElement): boolean {
		const isBody = element.closest(CSS_SELECTORS.CM_CONTENT);
		const isLine = element.closest(CSS_SELECTORS.CM_LINE);
		const isLink = element.closest(CSS_SELECTORS.CM_UNDERLINE);
		const isRoot = element.closest(CSS_SELECTORS.MOD_ROOT);
		return !!(isRoot || isBody || isLine || isLink);
	}

	/**
	 * Check if element is a tab header element
	 */
	static isTabHeader(element: HTMLElement): boolean {
		return !!element.closest(CSS_SELECTORS.WORKSPACE_TAB_HEADER_INNER_TITLE);
	}
}

/**
 * Utilities for type validation
 */
export class TypeGuards {
	/**
	 * Check if an element is an HTMLElement
	 */
	static isHTMLElement(element: unknown): element is HTMLElement {
		return element instanceof HTMLElement;
	}

	/**
	 * Safely cast an element to HTMLElement
	 */
	static safeCastToHTMLElement(element: unknown): HTMLElement | null {
		return TypeGuards.isHTMLElement(element) ? element : null;
	}
}
