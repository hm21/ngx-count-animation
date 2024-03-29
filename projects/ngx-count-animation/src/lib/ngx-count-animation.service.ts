import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, animationFrameScheduler, fromEvent, interval } from 'rxjs';
import { share, throttleTime } from 'rxjs/operators';
/**
 * Service to create an observable that emits increasing numbers periodically.
 */
@Injectable({
  providedIn: 'root'
})
export class NgxCountService {

  public scroll$!: Observable<Event>;

  private _interval?: Observable<number>;


  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: any,
  ) {
    if (isPlatformBrowser(this.platformId)) {
      // Observable for scroll events on the window
      this.scroll$ = fromEvent(this.document, 'scroll').pipe(
        throttleTime(50, undefined, { leading: true, trailing: true }),
        share(),
      );
    }
  }

  /**
   * Overrides the default scroll listener for the specified HTML element.
   *
   * @param {HTMLElement} element - The HTML element for which to override the scroll listener.
   * @returns {void}
   */
  public overrideScrollListener(element: HTMLElement): void {
    this.scroll$ = fromEvent(element, 'scroll').pipe(
      throttleTime(50, undefined, { leading: true, trailing: true }),
      share(),
    );
  }

  /**
   * Returns an Observable that emits an incrementing number each time
   * an animation frame is sent. The Observable is shared among all subscribers.
   * 
   * @returns {Observable<number>} An observable sequence that produces a value each animation frame.
   */
  public get interval(): Observable<number> {
    if (this._interval) return this._interval;

    return this._interval = interval(0, animationFrameScheduler).pipe(share());
  }
}
