import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Stop } from '../models/stop.model';
import { API_CONFIG } from '../../shared/common';

@Injectable({
  providedIn: 'root'
})
export class StopService {
  private apiUrl = `${API_CONFIG.BASE_URL}/api/stops`;

  constructor(private http: HttpClient) {}

  getByRouteId(routeId: string): Observable<Stop[]> {
    return this.http.get<Stop[]>(`${this.apiUrl}/by-route/${routeId}`);
  }

  createBatch(stops: Stop[]): Observable<Stop[]> {
    return this.http.post<Stop[]>(`${this.apiUrl}/batch`, stops);
  }

  deleteByRouteId(routeId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/by-route/${routeId}`);
  }
}