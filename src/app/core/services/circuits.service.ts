import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Circuit, CircuitComponent } from '../models/strength.model';

@Injectable({ providedIn: 'root' })
export class CircuitsService {
  private http = inject(HttpClient);
  private base = `${environment.apiBaseUrl}/Circuits`;

  getAll(): Observable<Circuit[]> {
    return this.http.get<Circuit[]>(this.base);
  }

  getById(id: number): Observable<Circuit> {
    return this.http.get<Circuit>(`${this.base}/${id}`);
  }

  create(circuit: Circuit): Observable<Circuit> {
    return this.http.post<Circuit>(this.base, circuit);
  }

  update(id: number, circuit: Circuit): Observable<void> {
    return this.http.put<void>(`${this.base}/${id}`, circuit);
  }

  getComponents(): Observable<CircuitComponent[]> {
    return this.http.get<CircuitComponent[]>(`${this.base}/GetCircuitComponents`);
  }

  getComponent(id: number): Observable<CircuitComponent> {
    return this.http.get<CircuitComponent>(`${this.base}/GetCircuitComponent/${id}`);
  }

  createComponent(component: CircuitComponent): Observable<CircuitComponent> {
    return this.http.post<CircuitComponent>(`${this.base}/PostCircuitComponent`, component);
  }

  updateComponent(id: number, component: CircuitComponent): Observable<void> {
    return this.http.put<void>(`${this.base}/PutCircuitComponent/${id}`, component);
  }
}
