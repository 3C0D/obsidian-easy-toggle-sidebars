/**
 * Encapsulates trackpad swipe gesture state (accumulated wheel deltas).
 * Unlike MouseState, a wheel-based gesture has no explicit start/end event:
 * a swipe fires a burst of many 'wheel' events, so the gesture's end must be
 * inferred via an inactivity timeout rather than a mouseup-like signal.
 */
export class WheelState {
  accumulatedX = 0;
  accumulatedY = 0;
  resetTimeout: NodeJS.Timeout | null = null;
  triggered = false; // prevents multiple toggles within the same swipe burst
}
