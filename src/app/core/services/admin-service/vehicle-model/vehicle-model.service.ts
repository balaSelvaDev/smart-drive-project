import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VehicleModelService {

  private getBrandsNameApi = 'http://localhost:9090/api/brands/brand-name';
  private addVehicleModelApi = 'http://localhost:9090/api/vehicle-models';
  private getVehicleModelsApi = 'http://localhost:9090/api/vehicle-models';

  constructor(private http: HttpClient) {}

  searchItems(query: string): Observable<any[]> {
    let params = new HttpParams().set('limit', 5);

    if (query && query.trim().length > 0) {
      params = params.set('search', query.trim());
    }
    console.log('Search query:', query, 'Params:', params.toString());

    return this.http.get<any[]>(`${this.getBrandsNameApi}`, { params });
  }

  addVehicleModel(vehicleModelData: any): Observable<any> {
    return this.http.post(`${this.addVehicleModelApi}`, vehicleModelData);
  }

  getVehicleModels(page: number, size: number): Observable<any> {
    return this.http.get(`${this.getVehicleModelsApi}?page=${page}&size=${size}`);
  }
}
