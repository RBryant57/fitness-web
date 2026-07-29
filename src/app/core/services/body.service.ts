import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { QuantityRequest } from '../models/common.model';
import { Weight } from '../models/body.model';

// Note: BodyController also declares GetMaxOdometerByBike/PostNonRideMiles/
// GetCurrentBikeParts actions, but they cast the controller's BodyData
// instance to BikeData, which throws InvalidCastException at runtime — a
// backend bug. Those capabilities are already covered by BikesService
// against BikesController, so they're intentionally omitted here.
@Injectable({ providedIn: 'root' })
export class BodyService {
  private http = inject(HttpClient);
  private base = `${environment.apiBaseUrl}/Body`;

  getAverageGymHours(request: QuantityRequest): Observable<number> {
    return this.http.post<number>(`${this.base}/GetAverageGymHours`, request);
  }

  getTotalGymHours(request: QuantityRequest): Observable<number> {
    return this.http.post<number>(`${this.base}/GetTotalGymHours`, request);
  }

  getWeightReadings(request: QuantityRequest): Observable<Weight[]> {
    return this.http.post<Weight[]>(`${this.base}/GetWeightReadings`, request);
  }
}
