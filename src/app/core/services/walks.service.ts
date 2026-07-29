import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { GpxRequest, QuantityRequest } from '../models/common.model';
import {
  RecreationalWalk,
  RecreationalWalkView,
  TrainingWalk,
  TrainingWalkView
} from '../models/walk.model';

@Injectable({ providedIn: 'root' })
export class WalksService {
  private http = inject(HttpClient);
  private base = `${environment.apiBaseUrl}/Walks`;

  // Recreational walks
  getRecreationalWalk(id: number): Observable<RecreationalWalk> {
    return this.http.get<RecreationalWalk>(`${this.base}/GetRecreationalWalks/${id}`);
  }

  getRecreationalWalks(request: QuantityRequest): Observable<RecreationalWalk[]> {
    return this.http.post<RecreationalWalk[]>(`${this.base}/GetRecreationalWalks`, request);
  }

  getRecreationalWalkViews(request: QuantityRequest): Observable<RecreationalWalkView[]> {
    return this.http.post<RecreationalWalkView[]>(`${this.base}/GetRecreationalWalkViews`, request);
  }

  postRecreationalWalk(request: GpxRequest): Observable<RecreationalWalk> {
    return this.http.post<RecreationalWalk>(`${this.base}/PostRecreationalWalk`, request);
  }

  // Training walks
  getTrainingWalk(id: number): Observable<TrainingWalk> {
    return this.http.get<TrainingWalk>(`${this.base}/GetTrainingWalks/${id}`);
  }

  getTrainingWalks(request: QuantityRequest): Observable<TrainingWalk[]> {
    return this.http.post<TrainingWalk[]>(`${this.base}/GetTrainingWalks`, request);
  }

  getTrainingWalkViews(request: QuantityRequest): Observable<TrainingWalkView[]> {
    return this.http.post<TrainingWalkView[]>(`${this.base}/GetTrainingWalkViews`, request);
  }

  postTrainingWalk(request: GpxRequest): Observable<TrainingWalk> {
    return this.http.post<TrainingWalk>(`${this.base}/PostTrainingWalk`, request);
  }
}
