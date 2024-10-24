import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import {
  animationFrameScheduler,
  fromEvent,
  interval,
  Observable,
  share,
  throttleTime,
} from 'rxjs';

/**
 * Service to create an observable that emits increasing numbers periodically.
 */
@Injectable({
  providedIn: 'root',
})
export class NgxCountService {
  private document = inject(DOCUMENT);

  public scroll$!: Observable<Event>;

  private _interval?: Observable<number>;

  constructor() {
    // Observable for scroll events on the window
    this.scroll$ = fromEvent(this.document, 'scroll').pipe(
      throttleTime(50, undefined, { leading: true, trailing: true }),
      share()
    );
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
      share()
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

    return (this._interval = interval(0, animationFrameScheduler).pipe(
      share()
    ));
  }
}
