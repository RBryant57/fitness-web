import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { pascalCaseInterceptor } from './interceptors/case-transform.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [provideHttpClient(withInterceptors([pascalCaseInterceptor])),
    provideRouter(routes), provideHttpClient()]
};
