import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Shoe, ShoeType } from '../models/equipment.model';
import { QuantityRequest } from '../models/common.model';

@Injectable({ providedIn: 'root' })
export class ShoesService {
  private http = inject(HttpClient);
  private base = `${environment.apiBaseUrl}/Shoes`;

  getAll(): Observable<Shoe[]> {
    return this.http.get<Shoe[]>(this.base);
  }

  getAllIncludingRetired(includeRetired: boolean): Observable<Shoe[]> {
    return this.http.get<Shoe[]>(`${this.base}/${includeRetired}`);
  }

  getById(id: number): Observable<Shoe> {
    return this.http.get<Shoe>(`${this.base}/${id}`);
  }

  create(shoe: Shoe): Observable<Shoe> {
    return this.http.post<Shoe>(this.base, shoe);
  }

  update(id: number, shoe: Shoe): Observable<void> {
    return this.http.put<void>(`${this.base}/${id}`, shoe);
  }

  getShoeTypes(): Observable<ShoeType[]> {
    return this.http.get<ShoeType[]>(`${this.base}/GetShoeTypes`);
  }

  getMilesByShoe(id: number): Observable<number> {
    return this.http.get<number>(`${this.base}/GetMilesByShoe/${id}`);
  }

  retireShoe(request: QuantityRequest): Observable<boolean> {
    return this.http.post<boolean>(`${this.base}/RetireShoe`, request);
  }
}
