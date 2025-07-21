import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private getUsersApi = 'http://localhost:9090/api/users';
  private addUsersApi = 'http://localhost:9090/api/users/user-admin';
  private pincode = 'https://pinlookup.in/api/pincode';

  constructor(private http: HttpClient) { }

  addUserByAdmin(userData: any): Observable<any> {
    return this.http.post(`${this.addUsersApi}`, userData);
  }

  getPincodeDetails(pincode: string): Observable<any> {
    return this.http.get<any>(`${this.pincode}`, { params: { pincode } });
  }

  getUsers(page: number, size: number): Observable<any> {
    return this.http.get(`${this.getUsersApi}?page=${page}&size=${size}`);
  }

}
