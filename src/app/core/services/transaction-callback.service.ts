import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TransactionCallback, PageResponse } from '../models/transaction-callback.model';
import { API_CONFIG } from '../../shared/common';

@Injectable({
  providedIn: 'root'
})
export class TransactionCallbackService {
  // API endpoint
  private baseUrl = `${API_CONFIG.BASE_URL}/api/transaction-callbacks`;

  constructor(private http: HttpClient) { }

  /**
   * Gọi API search transaction callbacks
   * @param searchData Dữ liệu tìm kiếm
   * @param page Số trang
   * @param pageSize Số bản ghi mỗi trang
   * @returns Observable của PageResponse<TransactionCallback>
   */
  search(searchData: TransactionCallback, page: number, pageSize: number): Observable<PageResponse<TransactionCallback>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', pageSize.toString());

    return this.http.post<PageResponse<TransactionCallback>>(`${this.baseUrl}/search`, searchData, { params });
  }
}