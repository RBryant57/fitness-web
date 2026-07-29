import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Route, RouteDirection, RouteType } from '../models/route.model';

@Injectable({ providedIn: 'root' })
export class RouteService {
  private http = inject(HttpClient);
  private base = `${environment.apiBaseUrl}/Routes`;

  getAll(): Observable<Route[]> {
    return this.http.get<Route[]>(this.base);
  }

  getById(id: number): Observable<Route> {
    return this.http.get<Route>(`${this.base}/${id}`);
  }

  create(route: Route): Observable<Route> {
    return this.http.post<Route>(this.base, route);
  }

  update(id: number, route: Route): Observable<void> {
    return this.http.put<void>(`${this.base}/${id}`, route);
  }

  getRouteDirections(routeId: number): Observable<RouteDirection[]> {
    return this.http.get<RouteDirection[]>(`${this.base}/GetRouteDirections/${routeId}`);
  }

  // Note: like PartsController, GetRouteTypes(id)/PutRouteType(id) share
  // the "{id}" template with GetRoutes(id)/PutRoute(id) — an ambiguous
  // route in the backend. The list endpoint below is unambiguous; edits
  // reuse data already loaded from getRouteTypes().
  getRouteTypes(): Observable<RouteType[]> {
    return this.http.get<RouteType[]>(`${this.base}/GetRouteTypes`);
  }

  createRouteType(routeType: RouteType): Observable<RouteType> {
    return this.http.post<RouteType>(`${this.base}/PostRouteType`, routeType);
  }

  updateRouteType(id: number, routeType: RouteType): Observable<void> {
    return this.http.put<void>(`${this.base}/${id}`, routeType);
  }
}
