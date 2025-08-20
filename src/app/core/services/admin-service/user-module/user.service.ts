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
  private getUsersByApi = "http://localhost:9090/api/users/individual";
  private getUsersForCustomerApi = 'http://localhost:9090/api/users/customer';
  private deleteUserApi = 'http://localhost:9090/api/users';
  private editUsersApi = 'http://localhost:9090/api/users/user-admin/edit';

  constructor(private http: HttpClient) { }

  addUserByAdmin(userData: any): Observable<any> {
    return this.http.post(`${this.addUsersApi}`, userData);
  }

  editUserByAdmin(userData: any): Observable<any> {
    return this.http.post(`${this.editUsersApi}`, userData);
  }

  getPincodeDetails(pincode: string): Observable<any> {
    return this.http.get<any>(`${this.pincode}`, { params: { pincode } });
  }

  getUsers(page: number, size: number): Observable<any> {
    return this.http.get(`${this.getUsersApi}?page=${page}&size=${size}`);
  }

  getUsersById(userId: String): Observable<any> {
    return this.http.get(`${this.getUsersByApi}?userId=${userId}`);
  }

  getUsersForCustomer(userId: number): Observable<any> {
    return this.http.get(`${this.getUsersForCustomerApi}/${userId}`);
  }
  
  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.deleteUserApi}/${userId}`);
  }

}
