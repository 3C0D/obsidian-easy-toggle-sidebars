export const UI_CONSTANTS = {
  SLIDER_STEP: 10,
  MOVEMENT_SLIDER_STEP: 20,
  SIDEBAR_MIN_SIZE: 200,
  NOTICE_DURATION: 2000,
  TRACKPAD_THRESHOLD_MIN: 30,
  TRACKPAD_THRESHOLD_MAX: 200,
  MIN_EDITOR_WIDTH: 200,
  MAX_EDITOR_WIDTH: 800
} as const;

export const CSS_SELECTORS = {
  CM_CONTENT_CONTAINER: '.cm-contentContainer',
  VIEW_HEADER_TITLE_CONTAINER: '.view-header-title-container',
  VIEW_HEADER_TITLE: '.view-header-title',
  WORKSPACE_TAB_HEADER_INNER_TITLE: '.workspace-tab-header-inner-title'
} as const;

export const DEFAULT_SETTINGS = {
  autoHide: true,
  autoHideRibbon: true,
  autoMinRootWidth: true,
  minRootWidth: 300,
  togglePin: true,
  reveal: true,
  useTrackpadSwipe: true,
  trackpadModifiers: { shift: false, ctrl: true, alt: false, meta: false },
  trackpadThreshold: 80,
  welcomeShown: false
} as const;
