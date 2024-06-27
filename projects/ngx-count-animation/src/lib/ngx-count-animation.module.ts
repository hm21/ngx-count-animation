import { InjectionToken, ModuleWithProviders, NgModule, Provider } from '@angular/core';

import { NgxCountAnimationDirective } from './ngx-count-animation.directive';
import { NgxCountAnimationConfigs } from './utils/coercion/ngx-count-animation-configs';

export const NGX_COUNT_ANIMATION_CONFIGS =
    new InjectionToken<NgxCountAnimationConfigs>('NgxCountAnimationConfigs');


@NgModule({
    imports: [NgxCountAnimationDirective],
    exports: [NgxCountAnimationDirective],
})
export class NgxCountAnimationModule {
    static forRoot(
        configs: NgxCountAnimationConfigs
    ): ModuleWithProviders<NgxCountAnimationModule> {
        return {
            ngModule: NgxCountAnimationModule,
            providers: [provideNgxCountAnimations(configs)],
        };
    }
}

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
