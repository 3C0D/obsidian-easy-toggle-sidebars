import { CSS_SELECTORS } from '../constants/index.ts';

/**
 * Utilities for DOM zone detection.
 * Used by autoHide and togglePin.
 */
export class ZoneDetector {
  /**
   * Check if element is in the view header zone (tab bar / title area).
   * Used by autoHide to avoid triggering when clicking the header
   * (title, buttons, breadcrumb, etc.).
   */
  static isViewHeader(element: HTMLElement): boolean {
    return !!element.closest('.view-header');
  }

  /**
   * Check if element is inside a workspace leaf (editor, Canvas, etc.).
   * Used by autoHide to detect clicks in the main content area.
   */
  static isEditorContent(element: HTMLElement): boolean {
    return !!element.closest('.workspace-leaf');
  }

  /**
   * Check if element is a tab header element.
   * Used by mouseUp for the Toggle Pin feature.
   */
  static isTabHeader(element: HTMLElement): boolean {
    return !!element.closest(CSS_SELECTORS.WORKSPACE_TAB_HEADER_INNER_TITLE);
  }
}
