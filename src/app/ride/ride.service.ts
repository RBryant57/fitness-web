import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GpxRequest } from '../common/common-model';
import { Constants } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class RideService {

  constructor(private http: HttpClient) { }

  public postTrainingRide(ride: GpxRequest) {
    var url = Constants.BaseUrl + 'api/rides/posttrainingride';

    const body = JSON.stringify(ride);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post(url, body, httpOptions);
  }

  public postRecreationalRide(ride: GpxRequest) {
    var url = Constants.BaseUrl + 'api/rides/postrecreationalride';

    const body = JSON.stringify(ride);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post(url, body, httpOptions);
  }
}
