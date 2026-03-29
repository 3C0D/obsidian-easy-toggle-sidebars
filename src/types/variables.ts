export interface ETSSettings {
	useRightMouse: boolean;
	useMiddleMouse: boolean;
	moveThresholdHor: number;
	moveThresholdVert: number;
	autoHide: boolean;
	autoHideRibbon: boolean;
	autoMinRootWidth: boolean;
	minRootWidth: number;
	dblClickDelay: number;
	togglePin: boolean;
	reveal: boolean;
}

// NOTE: DEFAULT_SETTINGS are now defined in src/constants/index.ts
// This file now only contains the interface definition
