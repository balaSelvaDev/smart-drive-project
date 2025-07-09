import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BrandService {

  private baseUrl = 'http://localhost:9090/api/brands';

  constructor(private http: HttpClient) { }

  getBrands(page: number, size: number): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }
}