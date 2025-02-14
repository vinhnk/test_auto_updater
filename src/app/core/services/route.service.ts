import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Route } from '../models/route.model';
import { API_CONFIG } from '../../shared/common';

@Injectable({
  providedIn: 'root'
})
export class RouteService {
  private apiUrl = `${API_CONFIG.BASE_URL}/api/routes`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Route[]> {
    return this.http.get<Route[]>(this.apiUrl);
  }

  getById(id: number): Observable<Route> {
    return this.http.get<Route>(`${this.apiUrl}/${id}`);
  }

  findByName(name: string): Observable<Route> {
    return this.http.get<Route>(`${this.apiUrl}/find-route-by-name/${name}`);
  }

  create(route: Route): Observable<Route> {
    return this.http.post<Route>(this.apiUrl, route);
  }

  update(route: Route): Observable<Route> {
    return this.http.put<Route>(`${this.apiUrl}/${route.id}`, route);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}