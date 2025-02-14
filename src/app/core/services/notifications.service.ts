import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Notifications, Page } from '../models/notifications.model';
import { API_CONFIG } from '../../shared/common';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private baseUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.NOTIFICATIONS.BASE}`; 

  constructor(private http: HttpClient) {}

  // Tìm kiếm notifications với phân trang
  searchNotifications(
    content: string = '',
    phone: string = '',
    page: number = 0,
    size: number = 10,
    sort: string[] = ['createdDate,desc']
  ): Observable<Page<Notifications>> {
    let params = new HttpParams()
      .set('content', content)
      .set('phone', phone)
      .set('page', page.toString())
      .set('size', size.toString());
    
    // Thêm các tham số sắp xếp
    sort.forEach(s => {
      params = params.append('sort', s);
    });

    return this.http.get<Page<Notifications>>(`${this.baseUrl}/search`, { params });
  }

  // Thêm method mới để gửi notification
  pushNotification(payload: { phones: string[], content: string }) {
    return this.http.post(`${this.baseUrl}/push`, payload);
  }
}