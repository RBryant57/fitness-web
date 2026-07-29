import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Bike, BikePart, NonRideMile } from '../models/equipment.model';

@Injectable({ providedIn: 'root' })
export class BikesService {
  private http = inject(HttpClient);
  private base = `${environment.apiBaseUrl}/Bikes`;

  getAll(): Observable<Bike[]> {
    return this.http.get<Bike[]>(this.base);
  }

  getById(id: number): Observable<Bike> {
    return this.http.get<Bike>(`${this.base}/${id}`);
  }

  create(bike: Bike): Observable<Bike> {
    return this.http.post<Bike>(this.base, bike);
  }

  update(id: number, bike: Bike): Observable<void> {
    return this.http.put<void>(`${this.base}/${id}`, bike);
  }

  getMaxOdometer(bikeId: number): Observable<number> {
    return this.http.get<number>(`${this.base}/GetMaxOdometerByBike/${bikeId}`);
  }

  getCurrentParts(bikeId: number): Observable<BikePart[]> {
    return this.http.get<BikePart[]>(`${this.base}/GetCurrentBikeParts/${bikeId}`);
  }

  postNonRideMiles(entry: NonRideMile): Observable<NonRideMile> {
    return this.http.post<NonRideMile>(`${this.base}/PostNonRideMiles`, entry);
  }
}
