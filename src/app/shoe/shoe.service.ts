import { Injectable, Inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { Shoe } from './shoe-model';
import { Constants } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class ShoeService {

  constructor(private http: HttpClient){
  }

  public getEntities(): Observable<Shoe[]> {
    return this.http.get<Shoe[]>(Constants.BaseUrl + 'api/shoes').pipe(
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
