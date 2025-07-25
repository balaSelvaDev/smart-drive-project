import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnonymousService {

  private getVehicleByIdApi = 'http://localhost:9090/api/vehicle/';

  constructor(private http: HttpClient) { }

  getVehicleById(id: string): Observable<any> {
    return this.http.get(`${this.getVehicleByIdApi}${id}`);
  }
}
