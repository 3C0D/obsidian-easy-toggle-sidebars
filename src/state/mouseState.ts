/**
 * Encapsulates mouse-related mutable state used by the plugin.
 * Most gesture tracking has moved to KeyGestureState (modifier+swipe).
 */
export class MouseState {
  /** True while any pointer button is held (between pointerdown and pointerup). */
  isButtonDown = false;
}
