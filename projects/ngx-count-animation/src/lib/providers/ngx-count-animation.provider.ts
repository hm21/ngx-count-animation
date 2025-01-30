import { InjectionToken, Provider } from '@angular/core';
import { NgxCountAnimationConfigs } from '../interfaces/ngx-count-animation.interface';

export const NGX_COUNT_ANIMATION_CONFIGS =
  new InjectionToken<NgxCountAnimationConfigs>('NgxCountAnimationConfigs');

export function provideNgxCountAnimations(
  configs?: NgxCountAnimationConfigs
): Provider {
  return [
    {
      provide: NGX_COUNT_ANIMATION_CONFIGS,
      useValue: configs,
    },
  ];
}
