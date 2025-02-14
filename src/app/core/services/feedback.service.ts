import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Feedback, FeedbackSearchCriteria } from '../models/feedback.model';
import { API_CONFIG } from '../../shared/common';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  private apiUrl = `${API_CONFIG.BASE_URL}/api/customer-feedbacks`;

  constructor(private http: HttpClient) {}

  search(criteria: FeedbackSearchCriteria): Observable<any> {
    let params = new HttpParams()
      .set('page', criteria.page?.toString() || '0')
      .set('size', criteria.size?.toString() || '10');
    
    if (criteria.customerName) {
      params = params.set('customerName', criteria.customerName);
    }
    if (criteria.content) {
      params = params.set('content', criteria.content);
    }

    return this.http.get(`${this.apiUrl}/search`, { params });
  }

  create(feedback: Feedback): Observable<Feedback> {
    return this.http.post<Feedback>(this.apiUrl, feedback);
  }

  update(feedback: Feedback): Observable<Feedback> {
    return this.http.put<Feedback>(`${this.apiUrl}/${feedback.id}`, feedback);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}