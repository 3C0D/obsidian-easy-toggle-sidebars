export interface ETSSettings {
  autoHide: boolean;
  autoHideRibbon: boolean;
  autoMinRootWidth: boolean;
  minRootWidth: number;
  togglePin: boolean;
  reveal: boolean;
  useTrackpadSwipe: boolean;
  trackpadModifiers: {
    shift: boolean;
    ctrl: boolean;
    alt: boolean;
    meta: boolean;
  };
  trackpadThreshold: number;
  welcomeShown: boolean;
}
