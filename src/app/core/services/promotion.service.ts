import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Promotion } from '../models/promotion.model';
import { API_CONFIG } from '../../shared/common';
import { NotificationResponse } from '../models/promotion.model';

@Injectable({
  providedIn: 'root'
})
export class PromotionService {
  private apiUrl = `${API_CONFIG.BASE_URL}/api/promotions`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Promotion[]> {
    return this.http.get<Promotion[]>(this.apiUrl);
  }

  getById(id: number): Observable<Promotion> {
    return this.http.get<Promotion>(`${this.apiUrl}/${id}`);
  }

  create(promotion: Promotion): Observable<Promotion> {
    return this.http.post<Promotion>(this.apiUrl, promotion);
  }

  update(promotion: Promotion): Observable<Promotion> {
    return this.http.put<Promotion>(`${this.apiUrl}/${promotion.id}`, promotion);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  findByName(name: string): Observable<Promotion[]> {
    return this.http.get<Promotion[]>(`${this.apiUrl}/search?name=${name}`);
  }

  // Gửi thông báo cho một khuyến mãi cụ thể
  sendNotification(id: number): Observable<NotificationResponse> {
    return this.http.post<NotificationResponse>(`${this.apiUrl}/${id}/notify`, {});
  }
}