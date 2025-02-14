import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BookTour, PageResponse, SearchCriteria } from '../models/booktours.model';
import { API_CONFIG } from '../../shared/common';

@Injectable({
  providedIn: 'root'
})
export class BookToursService {
  private apiUrl = `${API_CONFIG.BASE_URL}/api/book-tours`;

  constructor(private http: HttpClient) {}

  // Tìm kiếm book tours theo điều kiện
  search(criteria: SearchCriteria): Observable<PageResponse<BookTour>> {
    let params = new HttpParams()
      .set('page', criteria.page.toString())
      .set('size', criteria.size.toString());

    if (criteria.customerName) {
      params = params.set('customerName', criteria.customerName);
    }
    if (criteria.phone) {
      params = params.set('phone', criteria.phone);
    }

    return this.http.get<PageResponse<BookTour>>(`${this.apiUrl}/search`, { params });
  }

  // Lấy chi tiết book tour
  getDetail(id: number): Observable<BookTour> {
    return this.http.get<BookTour>(`${this.apiUrl}/${id}/detail`);
  }

  // Tạo mới book tour
  create(bookTour: BookTour): Observable<BookTour> {
    return this.http.post<BookTour>(this.apiUrl, bookTour);
  }

  // Cập nhật book tour
  update(id: number, bookTour: BookTour): Observable<BookTour> {
    return this.http.put<BookTour>(`${this.apiUrl}/${id}`, bookTour);
  }

  // Xóa book tour
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}