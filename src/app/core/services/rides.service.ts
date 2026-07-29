import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { GpxRequest, QuantityRequest } from '../models/common.model';
import {
  RecreationalRide,
  RecreationalRideView,
  StationaryRide,
  StationaryRideView,
  TrainingRide,
  TrainingRideView
} from '../models/ride.model';

@Injectable({ providedIn: 'root' })
export class RidesService {
  private http = inject(HttpClient);
  private base = `${environment.apiBaseUrl}/Rides`;

  // Training rides
  getTrainingRide(id: number): Observable<TrainingRide> {
    return this.http.get<TrainingRide>(`${this.base}/GetTrainingRides/${id}`);
  }

  getTrainingRides(request: QuantityRequest): Observable<TrainingRide[]> {
    return this.http.post<TrainingRide[]>(`${this.base}/GetTrainingRides`, request);
  }

  getTrainingRideView(id: number): Observable<TrainingRideView> {
    return this.http.get<TrainingRideView>(`${this.base}/GetTrainingRideViews/${id}`);
  }

  getTrainingRideViews(request: QuantityRequest): Observable<TrainingRideView[]> {
    return this.http.post<TrainingRideView[]>(`${this.base}/GetTrainingRideViews`, request);
  }

  postTrainingRide(request: GpxRequest): Observable<TrainingRide> {
    return this.http.post<TrainingRide>(`${this.base}/PostTrainingRide`, request);
  }

  // Recreational rides
  getRecreationalRide(id: number): Observable<RecreationalRide> {
    return this.http.get<RecreationalRide>(`${this.base}/GetRecreationalRides/${id}`);
  }

  getRecreationalRides(request: QuantityRequest): Observable<RecreationalRide[]> {
    return this.http.post<RecreationalRide[]>(`${this.base}/GetRecreationalRides`, request);
  }

  getRecreationalRideView(id: number): Observable<RecreationalRideView> {
    return this.http.get<RecreationalRideView>(`${this.base}/GetRecreationalRideViews/${id}`);
  }

  getRecreationalRideViews(request: QuantityRequest): Observable<RecreationalRideView[]> {
    return this.http.post<RecreationalRideView[]>(`${this.base}/GetRecreationalRideViews`, request);
  }

  postRecreationalRide(request: GpxRequest): Observable<RecreationalRide> {
    return this.http.post<RecreationalRide>(`${this.base}/PostRecreationalRide`, request);
  }

  // Stationary rides
  getStationaryRide(id: number): Observable<StationaryRide> {
    return this.http.get<StationaryRide>(`${this.base}/GetStationaryRides/${id}`);
  }

  getStationaryRides(request: QuantityRequest): Observable<StationaryRide[]> {
    return this.http.post<StationaryRide[]>(`${this.base}/GetStationaryRides`, request);
  }

  getStationaryRideViews(request: QuantityRequest): Observable<StationaryRideView[]> {
    return this.http.post<StationaryRideView[]>(`${this.base}/GetStationaryRideViews`, request);
  }

  postStationaryRide(ride: StationaryRide): Observable<StationaryRide> {
    return this.http.post<StationaryRide>(`${this.base}/PostStationaryRide`, ride);
  }
}
