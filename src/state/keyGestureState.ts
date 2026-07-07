export class KeyGestureState {
  armed = false;
  isTracking = false;
  startX = 0;
  startY = 0;
  /** Set to true after a successful toggle to ignore further mousemoves
   *  until the modifiers are released and re-armed. */
  done = false;
}
