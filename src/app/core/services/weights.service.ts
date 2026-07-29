import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Weight } from '../models/body.model';
import { QuantityRequest } from '../models/common.model';

@Injectable({ providedIn: 'root' })
export class WeightsService {
  private http = inject(HttpClient);
  private base = `${environment.apiBaseUrl}/Weights`;

  getAll(): Observable<Weight[]> {
    return this.http.get<Weight[]>(this.base);
  }

  getByDate(request: QuantityRequest): Observable<Weight[]> {
    return this.http.post<Weight[]>(`${this.base}/GetWeightsByDate`, request);
  }

  getById(id: number): Observable<Weight> {
    return this.http.get<Weight>(`${this.base}/${id}`);
  }

  create(weight: Weight): Observable<Weight> {
    return this.http.post<Weight>(this.base, weight);
  }

  update(id: number, weight: Weight): Observable<void> {
    return this.http.put<void>(`${this.base}/${id}`, weight);
  }
}
