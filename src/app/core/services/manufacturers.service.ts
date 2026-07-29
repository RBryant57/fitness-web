import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Manufacturer } from '../models/equipment.model';

@Injectable({ providedIn: 'root' })
export class ManufacturersService {
  private http = inject(HttpClient);
  private base = `${environment.apiBaseUrl}/Manufacturers`;

  getAll(): Observable<Manufacturer[]> {
    return this.http.get<Manufacturer[]>(this.base);
  }

  getById(id: number): Observable<Manufacturer> {
    return this.http.get<Manufacturer>(`${this.base}/${id}`);
  }

  create(manufacturer: Manufacturer): Observable<Manufacturer> {
    return this.http.post<Manufacturer>(this.base, manufacturer);
  }

  update(id: number, manufacturer: Manufacturer): Observable<void> {
    return this.http.put<void>(`${this.base}/${id}`, manufacturer);
  }
}
