import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Bike } from './bike-model';
import { Observable, catchError, throwError } from 'rxjs';
import { Constants } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class BikeService {

  constructor(private http: HttpClient){
  }

  public getEntities(): Observable<Bike[]> {
    return this.http.get<Bike[]>(Constants.BaseUrl + 'api/bikes').pipe(
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
