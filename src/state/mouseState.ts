/**
 * Encapsulates all mouse / gesture related mutable state used by the plugin.
 * Keeping this in a dedicated class avoids polluting the main plugin class
 * with many public mutable fields and makes the lifecycle easier to reason about.
 */
export class MouseState {
  startX = 0;
  startY = 0;
  endX = 0;
  endY = 0;
  button: number | null = null;
  isTracking = false;
  movedX = false;
  movedY = false;
  target: HTMLElement | null = null;
  preventContextmenu: NodeJS.Timeout | null = null;
  doubleClickTimeout: NodeJS.Timeout | null = null;
}
