import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BrandService {

  private getBrandsApi = 'http://localhost:9090/api/brands';
  private addBrandsApi = 'http://localhost:9090/api/brands';

  constructor(private http: HttpClient) { }

  getBrands(page: number, size: number): Observable<any> {
    return this.http.get(`${this.getBrandsApi}?page=${page}&size=${size}`);
  }

  addBrands(brandData: any): Observable<any> {
    return this.http.post(`${this.addBrandsApi}`, brandData);
  }
}
