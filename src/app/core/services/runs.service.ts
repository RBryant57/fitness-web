import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { GpxRequest, QuantityRequest } from '../models/common.model';
import {
  RecreationalRun,
  RecreationalRunView,
  TrainingRun,
  TrainingRunView,
  TreadmillRun,
  TreadmillRunView
} from '../models/run.model';

@Injectable({ providedIn: 'root' })
export class RunsService {
  private http = inject(HttpClient);
  private base = `${environment.apiBaseUrl}/Runs`;

  // Recreational runs
  getRecreationalRun(id: number): Observable<RecreationalRun> {
    return this.http.get<RecreationalRun>(`${this.base}/GetRecreationalRuns/${id}`);
  }

  getRecreationalRuns(request: QuantityRequest): Observable<RecreationalRun[]> {
    return this.http.post<RecreationalRun[]>(`${this.base}/GetRecreationalRuns`, request);
  }

  getRecreationalRunViews(request: QuantityRequest): Observable<RecreationalRunView[]> {
    return this.http.post<RecreationalRunView[]>(`${this.base}/GetRecreationalRunViews`, request);
  }

  postRecreationalRun(request: GpxRequest): Observable<RecreationalRun> {
    return this.http.post<RecreationalRun>(`${this.base}/PostRecreationalRun`, request);
  }

  // Training runs
  getTrainingRun(id: number): Observable<TrainingRun> {
    return this.http.get<TrainingRun>(`${this.base}/GetTrainingRuns/${id}`);
  }

  getTrainingRuns(request: QuantityRequest): Observable<TrainingRun[]> {
    return this.http.post<TrainingRun[]>(`${this.base}/GetTrainingRuns`, request);
  }

  getTrainingRunViews(request: QuantityRequest): Observable<TrainingRunView[]> {
    return this.http.post<TrainingRunView[]>(`${this.base}/GetTrainingRunViews`, request);
  }

  postTrainingRun(request: GpxRequest): Observable<TrainingRun> {
    return this.http.post<TrainingRun>(`${this.base}/PostTrainingRun`, request);
  }

  // Treadmill runs
  getTreadmillRun(id: number): Observable<TreadmillRun> {
    return this.http.get<TreadmillRun>(`${this.base}/GetTreadmillRuns/${id}`);
  }

  getTreadmillRuns(request: QuantityRequest): Observable<TreadmillRun[]> {
    return this.http.post<TreadmillRun[]>(`${this.base}/GetTreadmillRuns`, request);
  }

  getTreadmillRunViews(request: QuantityRequest): Observable<TreadmillRunView[]> {
    return this.http.post<TreadmillRunView[]>(`${this.base}/GetTreadmillRunViews`, request);
  }

  postTreadmillRun(run: TreadmillRun): Observable<TreadmillRun> {
    return this.http.post<TreadmillRun>(`${this.base}/PostTreadmillRun`, run);
  }

  getCrossingSuccessRate(request: QuantityRequest): Observable<number> {
    return this.http.post<number>(`${this.base}/GetCrossingSuccessRate`, request);
  }
}
