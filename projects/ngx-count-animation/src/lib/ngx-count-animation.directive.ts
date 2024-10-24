import {
  DestroyRef,
  Directive,
  ElementRef,
  OnInit,
  booleanAttribute,
  inject,
  input,
  numberAttribute,
  output,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import {
  Observable,
  animationFrameScheduler,
  combineLatest,
  delay,
  distinctUntilChanged,
  endWith,
  filter,
  finalize,
  interval,
  map,
  merge,
  switchMap,
  take,
  takeWhile,
  timer,
} from 'rxjs';
import { NgxCountService } from './ngx-count-animation.service';
import { NGX_COUNT_ANIMATION_CONFIGS } from './provider/ngx-count-animation.provider';
import {
  IS_BROWSER,
  providePlatformDetection,
} from './provider/platform.provider';

const easeOutQuad = (x: number): number => x * (2 - x);

/**
 * Directive to animate counting to a number.
 */
@Directive({
  standalone: true,
  selector: '[ngxCountAnimation]',
  providers: [providePlatformDetection()],
})
export class NgxCountAnimationDirective implements OnInit {
  private isBrowser = inject(IS_BROWSER);
  private destroyRef = inject(DestroyRef);
  private countService = inject(NgxCountService);
  private elRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private configs = inject(NGX_COUNT_ANIMATION_CONFIGS, { optional: true });

  /** Emits an event at the start of the animation. */
  public startAnimation = output();
  /** Emits an event at the end of the animation.*/
  public endAnimation = output();

  /**
   * When `enableLayoutChangeDetection` is set to `true`, there is always an interval listener active that detects layout changes.
   * @default true
   */
  public enableLayoutChangeDetection = input(
    this.configs?.enableLayoutChangeDetection ?? false,
    { transform: booleanAttribute }
  );
  /**
   * Boolean flag to enable running functionality only when the element is in the viewport.
   * @default true
   */
  public enableRunOnlyInViewport = input(
    this.configs?.enableRunOnlyInViewport ?? true,
    { transform: booleanAttribute }
  );
  /**
   * The maximum number of fraction digits to display.
   * @default 0
   */
  public maximumFractionDigits = input(
    this.configs?.maximumFractionDigits ?? 0,
    { transform: numberAttribute }
  );
  /**
   * The minimum number of fraction digits to display.
   * @default 0
   */
  public minimumFractionDigits = input(
    this.configs?.minimumFractionDigits ?? 0,
    { transform: numberAttribute }
  );
  /**
   * Sets the target count for the count animation.
   * @param count The target number to count to.
   */
  public ngxCountAnimation = input(0, { transform: numberAttribute });
  /**
   * Sets the duration of the count animation.
   * @param duration Duration of the animation in milliseconds.
   * @default 2_000
   */
  public duration = input(this.configs?.duration ?? 2000, {
    transform: numberAttribute,
  });
  /**
   * Sets the duration based on the given value.
   * @param value A value to determine the duration of the animation.
   */
  public durationFromValue = input(undefined, {
    transform: numberAttribute,
  });
  /**
   * Sets and gets the initial start delay value.
   * The input value is coerced into a number with a default of 0.
   */
  public initialStartDelay = input(0, { transform: numberAttribute });

  public oldCount = 0;

  private readonly currentCount$ = this.createCurrentCountObservable();

  ngOnInit(): void {
    this.elRef.nativeElement.classList.add('ngx-count-animation');
    this.initializeCountAnimation();
  }
  /**
   * Initializes the count animation if the element is in the viewport.
   */
  private initializeCountAnimation(): void {
    this.elRef.nativeElement.innerHTML = '0';

    if (this.isBrowser) {
      if (this.checkIsInViewport || !this.enableRunOnlyInViewport()) {
        this.startCount();
      } else {
        this.setupViewportCheck();
      }
    }
  }

  /**
   * Checks if the directive's element is in the viewport.
   * @returns {boolean} True if the element is in the viewport.
   */
  private get checkIsInViewport(): boolean {
    const rect = this.elRef.nativeElement.getBoundingClientRect();
    return rect.y < window.innerHeight;
  }

  /**
   * Sets up an observer to start the count when the element enters the viewport.
   */
  private setupViewportCheck(): void {
    merge(
      this.enableLayoutChangeDetection()
        ? interval(100, animationFrameScheduler)
        : timer(0),
      this.countService.scroll$
    )
      .pipe(
        filter(() => this.checkIsInViewport),
        take(1),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.startCount());
  }

  /**
   * Starts the count animation.
   */
  private startCount(): void {
    this.currentCount$
      .pipe(
        delay(this.initialStartDelay()),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((currentCount) => {
        this.elRef.nativeElement.innerHTML = currentCount.toLocaleString(
          ['de-ch'],
          {
            maximumFractionDigits: Math.max(
              this.minimumFractionDigits(),
              this.maximumFractionDigits()
            ),
            minimumFractionDigits: this.minimumFractionDigits(),
          }
        );
      });
  }

  /**
   * Creates an observable that emits the current count during the animation.
   * @returns {Observable<number>} An observable emitting the current count.
   */
  private createCurrentCountObservable(): Observable<number> {
    return combineLatest([
      toObservable(this.ngxCountAnimation),
      merge(
        toObservable(this.duration),
        toObservable(this.durationFromValue).pipe(
          filter((val) => val !== undefined),
          map((val) => {
            return val > 100
              ? 1500
              : val > 10
              ? 1000
              : val > 3
              ? 700
              : val > 1
              ? 400
              : 0;
          })
        )
      ),
    ]).pipe(
      delay(100),
      switchMap(([count, duration]) =>
        this.calculateCurrentCount(count, duration)
      )
    );
  }
  /**
   * Calculates the current count based on progress and duration.
   * @param count The target count.
   * @param duration The duration of the animation.
   * @returns {Observable<number>} An observable emitting the current count.
   */
  private calculateCurrentCount(
    count: number,
    duration: number
  ): Observable<number> {
    const startTime = animationFrameScheduler.now();
    this.startAnimation.emit();
    return this.countService.interval.pipe(
      // calculate elapsed time
      map(() => animationFrameScheduler.now() - startTime),
      // calculate progress
      map((elapsedTime) => elapsedTime / duration),
      // complete when progress is greater than 1
      takeWhile((progress) => progress <= 1),
      // apply quadratic ease-out function
      // for faster start and slower end of counting
      map(easeOutQuad),
      // calculate current count
      map(
        (progress) =>
          this.oldCount +
          Math.round((count - this.oldCount) * progress * 100) / 100
      ),
      // make sure that last emitted value is count
      endWith(count),
      finalize(() => {
        this.oldCount = count;
        this.endAnimation.emit();
      }),
      distinctUntilChanged()
    );
  }
}
