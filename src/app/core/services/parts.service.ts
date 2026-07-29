import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Part, PartAge, PartType } from '../models/equipment.model';

@Injectable({ providedIn: 'root' })
export class PartsService {
  private http = inject(HttpClient);
  private base = `${environment.apiBaseUrl}/Parts`;

  getAll(): Observable<Part[]> {
    return this.http.get<Part[]>(this.base);
  }

  getById(id: number): Observable<Part> {
    return this.http.get<Part>(`${this.base}/${id}`);
  }

  create(part: Part): Observable<Part> {
    return this.http.post<Part>(this.base, part);
  }

  update(id: number, part: Part): Observable<void> {
    return this.http.put<void>(`${this.base}/${id}`, part);
  }

  getPartAge(bikeId: number, partTypeId: number): Observable<PartAge> {
    return this.http.get<PartAge>(`${this.base}/GetPartAge`, {
      params: { bikeId, partTypeId }
    });
  }

  // Note: the backend's GetPartTypes(id)/PutPartType(id) actions share the
  // same "{id}" route template as GetParts(id)/PutPart(id), which is an
  // ambiguous-route conflict in PartsController. The list-based endpoints
  // below are unambiguous and safe; single-item PartType edits reuse data
  // already loaded from getPartTypes() rather than re-fetching by id.
  getPartTypes(): Observable<PartType[]> {
    return this.http.get<PartType[]>(`${this.base}/GetPartTypes`);
  }

  createPartType(partType: PartType): Observable<PartType> {
    return this.http.post<PartType>(`${this.base}/PostPartType`, partType);
  }

  updatePartType(id: number, partType: PartType): Observable<void> {
    return this.http.put<void>(`${this.base}/${id}`, partType);
  }
}
