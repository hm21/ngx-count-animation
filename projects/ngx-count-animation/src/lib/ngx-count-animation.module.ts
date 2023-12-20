import { NgModule } from '@angular/core';

import { NgxCountAnimationDirective } from './ngx-count-animation.directive';
import { NgxCountService } from './ngx-count-animation.service';

@NgModule({
    imports: [],
    exports: [NgxCountAnimationDirective],
    declarations: [NgxCountAnimationDirective],
    providers: [NgxCountService],
})
export class NgxCountAnimationModule { }
