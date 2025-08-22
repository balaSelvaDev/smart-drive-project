import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private getUserDetailsApi = 'http://localhost:9090/api/booking/search/username';
  private getVehicleDetailsApi = 'http://localhost:9090/api/booking/search/vehiclename';
  private addBookingApi = 'http://localhost:9090/api/booking';
  private getAllBookingApi = 'http://localhost:9090/api/booking';
  public getDashboardCountDetails = "http://localhost:9090/api/dashboard/counts";
  public getDashboardBookingDetails = "http://localhost:9090/api/dashboard/booking-details";

  constructor(private http: HttpClient) { }

  searchUserName(query: string): Observable<any[]> {
    let params = new HttpParams().set('limit', 5);

    if (query && query.trim().length > 0) {
      params = params.set('userName', query.trim());
    }
    console.log('Search query:', query, 'Params:', params.toString());

    return this.http.get<any[]>(`${this.getUserDetailsApi}`, { params });
  }

  searchVehicleName(query: string): Observable<any[]> {
    let params = new HttpParams().set('limit', 5);

    if (query && query.trim().length > 0) {
      params = params.set('vehicleName', query.trim());
    }
    console.log('Search query:', query, 'Params:', params.toString());

    return this.http.get<any[]>(`${this.getVehicleDetailsApi}`, { params });
  }

  addBooking(bookingData: any): Observable<any> {
    return this.http.post(`${this.addBookingApi}`, bookingData);
  }

  getgetAllBookingApiUsers(page: number, size: number): Observable<any> {
    return this.http.get(`${this.getAllBookingApi}?page=${page}&size=${size}`);
  }

  getCountsDetails(): Observable<any> {
    return this.http.get(`${this.getDashboardCountDetails}`);
  }

  getBookingDetails(): Observable<any> {
    return this.http.get(`${this.getDashboardBookingDetails}`);
  }

}
