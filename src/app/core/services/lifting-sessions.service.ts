import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { LiftingSession } from '../models/strength.model';
import { QuantityRequest } from '../models/common.model';

@Injectable({ providedIn: 'root' })
export class LiftingSessionsService {
  private http = inject(HttpClient);
  private base = `${environment.apiBaseUrl}/LiftingSessions`;

  getAll(): Observable<LiftingSession[]> {
    return this.http.get<LiftingSession[]>(this.base);
  }

  getByQuantity(request: QuantityRequest): Observable<LiftingSession[]> {
    return this.http.post<LiftingSession[]>(`${this.base}/GetLiftingSessions`, request);
  }

  getById(id: number): Observable<LiftingSession> {
    return this.http.get<LiftingSession>(`${this.base}/${id}`);
  }

  create(session: LiftingSession): Observable<LiftingSession> {
    return this.http.post<LiftingSession>(this.base, session);
  }

  update(id: number, session: LiftingSession): Observable<void> {
    return this.http.put<void>(`${this.base}/${id}`, session);
  }
}
