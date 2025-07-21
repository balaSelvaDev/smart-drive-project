import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  private getVehicleDetailsApi = 'http://localhost:9090/api/brands/search/brandname';
  private addVehicleDetailsApi = 'http://localhost:9090/api/vehicle';
  private getAllVehicleDetailsApi = 'http://localhost:9090/api/vehicle';
  private getClientLocationApi = 'http://localhost:9090/api/client-location';

  constructor(private http: HttpClient) { }

  searchBrandName(query: string): Observable<any[]> {
    let params = new HttpParams().set('limit', 5);

    if (query && query.trim().length > 0) {
      params = params.set('brandname', query.trim());
    }
    console.log('Search query:', query, 'Params:', params.toString());

    return this.http.get<any[]>(`${this.getVehicleDetailsApi}`, { params });
  }

  addVehicle(vehicleData: any): Observable<any> {
    return this.http.post(`${this.addVehicleDetailsApi}`, vehicleData);
  }

  getVehicles(page: number, size: number): Observable<any> {
    return this.http.get(`${this.getAllVehicleDetailsApi}?page=${page}&size=${size}`);
  }

  getClientLocation(districtId: number): Observable<any> {
    return this.http.get(`${this.getClientLocationApi}?districtId=${districtId}`);
  }

}
