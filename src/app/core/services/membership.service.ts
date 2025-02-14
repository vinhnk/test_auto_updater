import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Membership } from '../models/membership.model';
import { API_CONFIG } from '../../shared/common';

@Injectable({
  providedIn: 'root'
})
export class MembershipService {
  private apiUrl = `${API_CONFIG.BASE_URL}/api/member-ships`;

  constructor(private http: HttpClient) {}

  // Lấy danh sách tất cả membership
  getAllMemberships(): Observable<Membership[]> {
    return this.http.get<Membership[]>(this.apiUrl);
  }

  // Tạo mới một membership
  createMembership(membership: Membership): Observable<Membership> {
    return this.http.post<Membership>(this.apiUrl, membership);
  }

  // Cập nhật một membership
  updateMembership(id: number, membership: Membership): Observable<Membership> {
    return this.http.put<Membership>(`${this.apiUrl}/${id}`, membership);
  }

  // Xóa một membership
  deleteMembership(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}