import { isPlatformBrowser } from '@angular/common';
import { Directive, ElementRef, EventEmitter, Inject, Input, NgZone, OnDestroy, OnInit, Optional, Output, PLATFORM_ID, Renderer2 } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  Subject,
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
  takeUntil,
  takeWhile,
  timer
} from 'rxjs';
import { NGX_COUNT_ANIMATION_CONFIGS } from './ngx-count-animation.module';
import { NgxCountService } from './ngx-count-animation.service';
import { BooleanInput, coerceBooleanProperty } from './utils/coercion/coercion-boolean';
import { NumberInput, coerceNumberProperty } from './utils/coercion/coercion-number';
import { NgxCountAnimationConfigs } from './utils/coercion/ngx-count-animation-configs';


const easeOutQuad = (x: number): number => x * (2 - x);


/**
 * Directive to animate counting to a number.
 */
@Directive({
  standalone: true,
  selector: '[ngxCountAnimation]',
})
export class NgxCountAnimationDirective implements OnInit, OnDestroy {
  /**
   * Emits an event at the start of the animation.
   */
  @Output() startAnimation = new EventEmitter<void>();

  /**
   * Emits an event at the end of the animation.
   */
  @Output() endAnimation = new EventEmitter<void>();


  /** 
   * When `detectLayoutChanges` is set to `true`, there is always an interval listener active that detects layout changes.
   * @default true
   */
  @Input()
  set detectLayoutChanges(value: BooleanInput) {
    this._detectLayoutChanges = coerceBooleanProperty(value);
  }
  get detectLayoutChanges(): boolean {
    return this._detectLayoutChanges;
  }
  private _detectLayoutChanges: boolean = false;


  /**
  * The maximum number of fraction digits to display.
  * @type {number}
  * @default 0
  */
  @Input()
  set maximumFractionDigits(value: NumberInput) {
    this._maximumFractionDigits = coerceNumberProperty(value, 0);
  }
  get maximumFractionDigits(): number {
    return this._maximumFractionDigits;
  }
  private _maximumFractionDigits: number = 0;


  /**
    * The minimum number of fraction digits to display.
    * @type {number}
    * @default 0
    */
  @Input()
  set minimumFractionDigits(value: any) {
    this._minimumFractionDigits = coerceNumberProperty(value, 0);
  }
  get minimumFractionDigits(): number {
    return this._minimumFractionDigits;
  }
  private _minimumFractionDigits: number = 0;


  /**
   * Sets the target count for the count animation.
   * @param count The target number to count to.
   */
  @Input()
  set ngxCountAnimation(value: NumberInput) {
    this.zone.runOutsideAngular(() => {
      this.count$.next(coerceNumberProperty(value, 0));
    });
  }


  /**
   * Sets the duration of the count animation.
   * @param duration Duration of the animation in milliseconds.
   * @default 2_000
   */
  @Input()
  set duration(duration: NumberInput) {
    this.zone.runOutsideAngular(() => {
      this.duration$.next(coerceNumberProperty(duration, 2000));
    });
  }

  /**
   * Sets the duration based on the given value.
   * @param value A value to determine the duration of the animation.
   */
  @Input()
  set durationFromValue(value: NumberInput) {
    this.zone.runOutsideAngular(() => {
      const val = coerceNumberProperty(value);
      this.duration$.next(
        val > 100 ? 1500 :
          val > 10 ? 1000 :
            val > 3 ? 700 :
              val > 1 ? 400 : 0
      );
    });
  }

  public oldCount = 0;

  private readonly count$ = new BehaviorSubject(0);
  private readonly duration$ = new BehaviorSubject(2_000);

  private readonly currentCount$ = this.createCurrentCountObservable();

  private destroy$ = new Subject();

  constructor(
    private zone: NgZone,
    private countService: NgxCountService,
    private elRef: ElementRef<HTMLElement>,
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: any,
    @Optional() @Inject(NGX_COUNT_ANIMATION_CONFIGS) configs: NgxCountAnimationConfigs | undefined,
  ) {
    if (configs) {
      if (configs.duration !== undefined) {
        this.duration = configs.duration;
      }
      if (configs.detectLayoutChanges !== undefined) {
        this.detectLayoutChanges = configs.detectLayoutChanges;
      }
      if (configs.maximumFractionDigits !== undefined) {
        this.maximumFractionDigits = configs.maximumFractionDigits;
      }
      if (configs.minimumFractionDigits !== undefined) {
        this.minimumFractionDigits = configs.minimumFractionDigits;
      }
    }
  }

  ngOnInit(): void {
    this.elRef.nativeElement.classList.add('ngx-count-animation');
    if (isPlatformBrowser(this.platformId)) {
      this.initializeCountAnimation();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  /**
   * Initializes the count animation if the element is in the viewport.
   */
  private initializeCountAnimation(): void {
    this.renderer.setProperty(this.elRef.nativeElement, 'innerHTML', 0);
    this.zone.runOutsideAngular(() => {
      if (this.checkIsInViewport) {
        this.startCount();
      } else {
        this.setupViewportCheck();
      }
    });
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
      this.detectLayoutChanges ? interval(100, animationFrameScheduler) : timer(0),
      this.countService.scroll$
    )
      .pipe(
        filter(() => this.checkIsInViewport),
        takeUntil(this.destroy$),
        take(1)
      )
      .subscribe(() => this.startCount());
  }

  /**
   * Starts the count animation.
   */
  private startCount(): void {
    this.currentCount$
      .pipe(
        takeUntil(this.destroy$)
      ).subscribe((currentCount) => {
        this.renderer.setProperty(
          this.elRef.nativeElement,
          'innerHTML',
          currentCount.toLocaleString(['de-ch'], {
            maximumFractionDigits: Math.max(this.minimumFractionDigits, this.maximumFractionDigits),
            minimumFractionDigits: this.minimumFractionDigits
          })
        );
      });
  }

  /**
   * Creates an observable that emits the current count during the animation.
   * @returns {Observable<number>} An observable emitting the current count.
   */
  private createCurrentCountObservable(): Observable<number> {
    return combineLatest([this.count$, this.duration$]).pipe(
      delay(100),
      switchMap(([count, duration]) => this.calculateCurrentCount(count, duration)),
    );
  }
  /**
   * Calculates the current count based on progress and duration.
   * @param count The target count.
   * @param duration The duration of the animation.
   * @returns {Observable<number>} An observable emitting the current count.
   */
  private calculateCurrentCount(count: number, duration: number): Observable<number> {
    const startTime = animationFrameScheduler.now();
    this.startAnimation.emit();
    return this.countService.interval.pipe(
      // calculate elapsed time
      map(() => animationFrameScheduler.now() - startTime),
      // calculate progress
      map(elapsedTime => elapsedTime / duration),
      // complete when progress is greater than 1
      takeWhile(progress => progress <= 1),
      // apply quadratic ease-out function
      // for faster start and slower end of counting
      map(easeOutQuad),
      // calculate current count
      map(progress => this.oldCount + Math.round((count - this.oldCount) * progress * 100) / 100),
      // make sure that last emitted value is count
      endWith(count),
      finalize(() => {
        this.oldCount = count;
        this.endAnimation.emit();
      }),
      distinctUntilChanged(),
    );
  }
}
