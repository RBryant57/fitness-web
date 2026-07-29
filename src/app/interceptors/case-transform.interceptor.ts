import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';

function toPascalCase(value: any): any {
  if (Array.isArray(value)) {
    return value.map(toPascalCase);
  }
  if (value !== null && typeof value === 'object') {
    const result: any = {};
    for (const key of Object.keys(value)) {
      const pascalKey = key.charAt(0).toUpperCase() + key.slice(1);
      result[pascalKey] = toPascalCase(value[key]);
    }
    return result;
  }
  return value;
}

export const pascalCaseInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    map(event => {
      if (event instanceof HttpResponse && event.body) {
        return event.clone({ body: toPascalCase(event.body) });
      }
      return event;
    })
  );
};