import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private getUserDetailsApi = 'http://localhost:9090/api/booking/search/username';
  private getVehicleDetailsApi = 'http://localhost:9090/api/booking/search/vehiclename';

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
}
