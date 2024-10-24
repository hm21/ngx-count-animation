export interface NgxCountAnimationConfigs {
  /**
   * Sets the duration of the count animation.
   * @param duration Duration of the animation in milliseconds.
   * @default 2_000
   */
  duration?: number;
  /**
   * The maximum number of fraction digits to display.
   * @type {number}
   * @default 0
   */
  maximumFractionDigits?: number;
  /**
   * The minimum number of fraction digits to display.
   * @type {number}
   * @default 0
   */
  minimumFractionDigits?: number;
  /**
   * When `enableLayoutChangeDetection` is set to `true`, there is always an interval listener active that detects layout changes.
   * @default false
   */
  enableLayoutChangeDetection?: boolean;

  /**
   * Boolean flag to enable running functionality only when the element is in the viewport.
   * @default true
   */
  enableRunOnlyInViewport?: boolean;
}
