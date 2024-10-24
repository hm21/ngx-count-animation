import { ApplicationConfig, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideClientHydration } from '@angular/platform-browser';
import { provideNgxCountAnimations } from 'ngx-count-animation';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    
    provideRouter(routes),
    provideClientHydration(),
    provideNgxCountAnimations({
      /// Add your global configs
    }),
  ]
};
