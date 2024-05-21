import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GpxRequest } from '../common/common-model';
import { Constants } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class RunService {

  constructor(private http: HttpClient) { }

  public postTrainingRun(run: GpxRequest) {
    var url = Constants.BaseUrl + 'api/rides/posttrainingrun';

    const body = JSON.stringify(run);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post(url, body, httpOptions);
  }

  public postRecreationalRun(run: GpxRequest) {
    var url = Constants.BaseUrl + 'api/rides/postrecreationalrun';

    const body = JSON.stringify(run);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post(url, body, httpOptions);
  }
}
