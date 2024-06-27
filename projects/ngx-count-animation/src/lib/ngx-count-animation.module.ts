import { ModuleWithProviders, NgModule } from '@angular/core';

import { NgxCountAnimationDirective } from './ngx-count-animation.directive';
import { provideNgxCountAnimations } from './ngx-count-animation.provider';
import { NgxCountAnimationConfigs } from './utils/coercion/ngx-count-animation-configs';


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
