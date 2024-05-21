import { Injectable, Inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { Route } from './route-model';
import { Constants } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class RouteService {

  constructor(private http: HttpClient){
  }

  public getEntities(): Observable<Route[]> {
    return this.http.get<Route[]>(Constants.BaseUrl + 'api/routes').pipe(
      //tap(data => console.log('All: ' + JSON.stringify(data))),
      catchError(this.handleError)
     );
  }

  private handleError(err: HttpErrorResponse) {
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
