import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Booking, PageResponse } from '../models/booking.model';
import { API_CONFIG } from '../../shared/common';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private apiUrl = `${API_CONFIG.BASE_URL}/api/bookings`;
  constructor(private http: HttpClient) {}
  getBookings(
    page: number,
    size: number,
    selectedDeparture?: string,
    selectedDestination?: string
  ): Observable<PageResponse<Booking>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    if (selectedDeparture) {
      params = params.set('selectedDeparture.contains', selectedDeparture);
    }
    if (selectedDestination) {
      params = params.set('selectedDestination.contains', selectedDestination);
    }
    return this.http.get<PageResponse<Booking>>(this.apiUrl, { params });
  }
  getBooking(id: number): Observable<Booking> {
    return this.http.get<Booking>(`${this.apiUrl}/${id}`);
  }
  createBooking(booking: Booking): Observable<Booking> {
    return this.http.post<Booking>(this.apiUrl, booking);
  }
  updateBooking(booking: Booking): Observable<Booking> {
    return this.http.put<Booking>(`${this.apiUrl}/${booking.id}`, booking);
  }
  deleteBooking(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  partialUpdateBooking(booking: Partial<Booking>): Observable<Booking> {
    return this.http.patch<Booking>(
      `${this.apiUrl}/${booking.id}`,
      booking,
      {
        headers: {
          'Content-Type': 'application/merge-patch+json'
        }
      }
    );
  }
}
