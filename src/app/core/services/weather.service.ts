import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { QuantityRequest } from '../models/common.model';
import { WindDirectionStat } from '../models/analytics.model';

@Injectable({ providedIn: 'root' })
export class WeatherService {
  private http = inject(HttpClient);
  private base = `${environment.apiBaseUrl}/Weather`;

  getAverageTemperature(request: QuantityRequest): Observable<number> {
    return this.http.post<number>(`${this.base}/GetAverageTemperature`, request);
  }

  getAverageWindSpeed(request: QuantityRequest): Observable<number> {
    return this.http.post<number>(`${this.base}/GetAverageWindSpeed`, request);
  }

  getRainDays(request: QuantityRequest): Observable<number> {
    return this.http.post<number>(`${this.base}/GetRainDays`, request);
  }

  getWindDistribution(request: QuantityRequest): Observable<WindDirectionStat[]> {
    return this.http.post<WindDirectionStat[]>(`${this.base}/GetWindDistribution`, request);
  }
}
