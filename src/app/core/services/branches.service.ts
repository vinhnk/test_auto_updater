import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Branch } from '../models/branches.model';
import { API_CONFIG } from '../../shared/common';

@Injectable({
  providedIn: 'root'
})
export class BranchesService {
  private apiUrl = `${API_CONFIG.BASE_URL}/api/branches`;

  constructor(private http: HttpClient) {}

  /**
   * Lấy tất cả chi nhánh
   */
  getAll(): Observable<Branch[]> {
    return this.http.get<Branch[]>(this.apiUrl);
  }

  /**
   * Lấy chi nhánh theo id
   * @param id ID của chi nhánh
   */
  getById(id: number): Observable<Branch> {
    return this.http.get<Branch>(`${this.apiUrl}/${id}`);
  }

  /**
   * Tạo mới chi nhánh
   * @param branch Thông tin chi nhánh cần tạo
   */
  create(branch: Branch): Observable<Branch> {
    return this.http.post<Branch>(this.apiUrl, branch);
  }

  /**
   * Cập nhật chi nhánh
   * @param branch Thông tin chi nhánh cần cập nhật
   */
  update(branch: Branch): Observable<Branch> {
    return this.http.put<Branch>(`${this.apiUrl}/${branch.id}`, branch);
  }

  /**
   * Xóa chi nhánh
   * @param id ID của chi nhánh cần xóa
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}