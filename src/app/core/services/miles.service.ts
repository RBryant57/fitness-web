import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { QuantityRequest } from '../models/common.model';
import { BikeOnlyMile, MileageDistribution, MissedMile, OutdoorIndoor } from '../models/analytics.model';

@Injectable({ providedIn: 'root' })
export class MilesService {
  private http = inject(HttpClient);
  private base = `${environment.apiBaseUrl}/Miles`;

  getMilesByDateByType(request: QuantityRequest): Observable<number> {
    return this.http.post<number>(`${this.base}/GetMilesByDateByType`, request);
  }

  getMilesByDateByEquipment(request: QuantityRequest): Observable<number> {
    return this.http.post<number>(`${this.base}/GetMilesByDateByEquipment`, request);
  }

  getMileageDistribution(request: QuantityRequest): Observable<MileageDistribution[]> {
    return this.http.post<MileageDistribution[]>(`${this.base}/GetMileageDistribution`, request);
  }

  postMissedMiles(entry: MissedMile): Observable<MissedMile> {
    return this.http.post<MissedMile>(`${this.base}/PostMissedMiles`, entry);
  }

  getMissedMilesByDateByType(request: QuantityRequest): Observable<number> {
    return this.http.post<number>(`${this.base}/GetMissedMilesByDateByType`, request);
  }

  postBikeOnlyMiles(entry: BikeOnlyMile): Observable<BikeOnlyMile> {
    return this.http.post<BikeOnlyMile>(`${this.base}/PostBikeOnlyMiles`, entry);
  }

  getOutdoorIndoorRides(year: number): Observable<OutdoorIndoor[]> {
    return this.http.get<OutdoorIndoor[]>(`${this.base}/GetOutdoorIndoorRides/${year}`);
  }
}
