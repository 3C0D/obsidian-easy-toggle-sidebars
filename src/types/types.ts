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

export const DEFAULT_SETTINGS: ETSSettings = {
    useRightMouse: true,
    useMiddleMouse: true,
    moveThresholdHor: 50,
    moveThresholdVert: 50,
    autoHide: true,
    autoHideRibbon: true,
    autoMinRootWidth: true,
    minRootWidth: 300,
    dblClickDelay: 450,
    togglePin: true,
    reveal: true
};