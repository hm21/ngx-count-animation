import { isPlatformBrowser } from '@angular/common';
import { DestroyRef, Directive, ElementRef, Inject, Input, NgZone, OnInit, PLATFORM_ID, Renderer2, booleanAttribute, inject, numberAttribute } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  BehaviorSubject,
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
  timer
} from 'rxjs';
import { NgxCountUpService } from './ngx-count-animation.service';


const easeOutQuad = (x: number): number => x * (2 - x);


/**
 * Directive to animate counting up to a number.
 */
@Directive({
  selector: '[ngxCountAnimation]',
  standalone: true,
})
export class NgxCountAnimationDirective implements OnInit {
  /** 
   * Without an active highPerformance mode, there is always an interval listener active that detects layout changes.
   * @type {boolean}
   * @default true
   */
  @Input({ transform: booleanAttribute }) highPerformance: boolean = true;
  /**
  * The maximum number of fraction digits to display.
  * @type {number}
  * @default 0
  */
  @Input({ transform: numberAttribute }) maximumFractionDigits: number = 0;
  /**
   * The minimum number of fraction digits to display.
   * @type {number}
   * @default 0
   */
  @Input({ transform: numberAttribute }) minimumFractionDigits: number = 0;


  /**
   * Sets the target count for the count-up animation.
   * @param count The target number to count up to.
   */
  @Input({ alias: 'ngxCountAnimation', transform: numberAttribute })
  set count(count: number) {
    this.zone.runOutsideAngular(() => {
      this.count$.next(count);
    });
  }

  /**
   * Sets the duration of the count-up animation.
   * @param duration Duration of the animation in milliseconds.
   * @default 2_000
   */
  @Input({ transform: numberAttribute })
  set duration(duration: number) {
    this.zone.runOutsideAngular(() => {
      this.duration$.next(duration);
    });
  }

  /**
   * Sets the duration based on the given value.
   * @param value A value to determine the duration of the animation.
   */
  @Input({ transform: numberAttribute })
  set durationFromValue(value: number) {
    this.zone.runOutsideAngular(() => {
      this.duration$.next(
        value > 100 ? 1500 :
          value > 10 ? 1000 :
            value > 3 ? 700 :
              value > 1 ? 400 : 0
      );
    });
  }

  private oldCount = 0;

  private readonly count$ = new BehaviorSubject(0);
  private readonly duration$ = new BehaviorSubject(2_000);

  private readonly currentCount$ = this.createCurrentCountObservable();

  private zone = inject(NgZone);
  private destroyRef = inject(DestroyRef);
  private countUpService = inject(NgxCountUpService);
  private readonly elRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly renderer = inject(Renderer2);

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
  ) { }

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.initializeCountUp();
  }

  /**
   * Initializes the count-up animation if the element is in the viewport.
   */
  private initializeCountUp(): void {
    this.elRef.nativeElement.classList.add('ngx-count-animation');
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
      !this.highPerformance ? interval(100, animationFrameScheduler) : timer(0),
      this.countUpService.scroll$
    )
      .pipe(
        filter(() => this.checkIsInViewport),
        takeUntilDestroyed(this.destroyRef),
        take(1)
      )
      .subscribe(() => this.startCount());
  }

  /**
   * Starts the count-up animation.
   */
  private startCount(): void {
    this.currentCount$
      .pipe(
        takeUntilDestroyed(this.destroyRef)
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
    return this.countUpService.interval.pipe(
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
      finalize(() => { this.oldCount = count; }),
      distinctUntilChanged(),
    );
  }
}
