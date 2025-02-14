import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DeviceToken } from '../models/device-token.model';
import { API_CONFIG } from '../../shared/common';
import { Page } from '../models/notifications.model';

@Injectable({
  providedIn: 'root'
})
export class DeviceTokenService {
  private baseUrl = `${API_CONFIG.BASE_URL}/api/device-tokens`;

  constructor(private http: HttpClient) { }

  search(criteria: DeviceToken): Observable<Page<DeviceToken>> {
    return this.http.post<Page<DeviceToken>>(`${this.baseUrl}/search`, criteria);
  }

  update(id: number, data: Partial<DeviceToken>): Observable<DeviceToken> {
    return this.http.patch<DeviceToken>(`${this.baseUrl}/${id}`, data);
  }
}