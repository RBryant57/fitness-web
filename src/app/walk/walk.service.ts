import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TrainingWalk } from './walk-model';
import { Constants } from '../constants';
import { GpxRequest } from '../common/common-model';

@Injectable({
  providedIn: 'root'
})
export class WalkService {

  constructor(private http: HttpClient) { }

  public postTrainingWalk(walk: GpxRequest) {
    var url = Constants.BaseUrl + 'api/walks/posttrainingwalk';

    const body = JSON.stringify(walk);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post(url, body, httpOptions);
  }

  public postRecreationalWalk(walk: GpxRequest) {
    var url = Constants.BaseUrl + 'api/walks/postrecreationalwalk';

    const body = JSON.stringify(walk);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post(url, body, httpOptions);
  }

}
