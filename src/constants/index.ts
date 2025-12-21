export const UI_CONSTANTS = {
    EDGE_ZONE_WIDTH: 40,
    DEFAULT_DOUBLE_CLICK_DELAY: 450,
    MIN_EDITOR_WIDTH: 200,
    MAX_EDITOR_WIDTH: 800,
    MOVE_THRESHOLD_MIN: 50,
    MOVE_THRESHOLD_MAX: 410,
    SLIDER_STEP: 10,
    MOVEMENT_SLIDER_STEP: 20,
    SIDEBAR_MIN_SIZE: 200,
    CONTEXTMENU_TIMEOUT: 20,
    RIBBON_TOGGLE_DELAY: 300,
    NOTICE_DURATION: 2000,
} as const;

export const CSS_SELECTORS = {
    CM_CONTENT: ".cm-content",
    CM_LINE: ".cm-line",
    CM_UNDERLINE: ".cm-underline",
    MOD_ROOT: ".mod-root",
    CM_SCROLLER: ".cm-scroller",
    WORKSPACE_RIBBON: ".workspace-ribbon",
    MOD_ROOT_VIEW_CONTENT: ".mod-root .view-content",
    VIEW_HEADER_TITLE_CONTAINER: ".view-header-title-container",
    VIEW_HEADER_TITLE: ".view-header-title",
    MOD_LEFT_SPLIT: ".mod-left-split",
    WORKSPACE_TAB_HEADER_INNER_TITLE: ".workspace-tab-header-inner-title",
} as const;

export const DEFAULT_SETTINGS = {
    useRightMouse: true,
    useMiddleMouse: true,
    moveThresholdHor: UI_CONSTANTS.MOVE_THRESHOLD_MIN,
    moveThresholdVert: UI_CONSTANTS.MOVE_THRESHOLD_MIN,
    autoHide: true,
    autoHideRibbon: true,
    autoMinRootWidth: true,
    minRootWidth: 300,
    dblClickDelay: UI_CONSTANTS.DEFAULT_DOUBLE_CLICK_DELAY,
    togglePin: true,
    reveal: true
} as const;
