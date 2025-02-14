import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tour, TourSearchResponse } from '../models/tour.model';
import { API_CONFIG } from '../../shared/common';

@Injectable({
  providedIn: 'root',
})
export class TourService {
  private apiUrl = `${API_CONFIG.BASE_URL}/api/tours`;

  constructor(private http: HttpClient) {}

  // Tìm kiếm tours với phân trang
  searchTours(
    title: string = '',
    page: number = 0,
    size: number = 10
  ): Observable<TourSearchResponse> {
    let params = new HttpParams()
      .set('title', title)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<TourSearchResponse>(`${this.apiUrl}/search`, {
      params,
    });
  }

  // Lấy chi tiết tour theo id
  getTour(id: number): Observable<Tour> {
    return this.http.get<Tour>(`${this.apiUrl}/${id}`);
  }

  // Tạo mới tour
  createTour(tour: Tour): Observable<Tour> {
    return this.http.post<Tour>(this.apiUrl, tour);
  }

  // Cập nhật tour
  updateTour(tour: Tour): Observable<Tour> {
    return this.http.put<Tour>(`${this.apiUrl}/${tour.id}`, tour);
  }

  // Xóa tour
  deleteTour(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
