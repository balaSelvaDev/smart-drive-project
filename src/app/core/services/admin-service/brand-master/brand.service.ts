import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginService } from '../login-module/login.service';

@Injectable({
  providedIn: 'root'
})
export class BrandService {

  private getBrandsApi = 'http://localhost:9090/api/brands';
  private addBrandsApi = 'http://localhost:9090/api/brands';
  private updateBrandsApi = 'http://localhost:9090/api/brands';

  constructor(private http: HttpClient, private loginService: LoginService) { }

  // getBrands(page: number, size: number): Observable<any> {
  //   return this.http.get(`${this.getBrandsApi}?page=${page}&size=${size}`, {
  //     headers: new HttpHeaders({
  //       'Authorization': `Bearer ${this.loginService.getTokenFromCookie()}`
  //     })
  //   });
  // }
  getBrands(page: number, size: number): Observable<any> {
    return this.http.get(`${this.getBrandsApi}?page=${page}&size=${size}`);
  }

  addBrands(brandData: any): Observable<any> {
    return this.http.post(`${this.addBrandsApi}`, brandData);
  }

  updateBrands(brandData: any): Observable<any> {
    return this.http.put(`${this.updateBrandsApi}`, brandData);
  }

  getBrandsById(brandId: number): Observable<any> {
    return this.http.get(`${this.getBrandsApi}/${brandId}`);
  }
}

