import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private addUsersApi = 'http://localhost:9090/api/users/user-admin';

  constructor(private http: HttpClient) { }

  addUserByAdmin(userData: any): Observable<any> {
    return this.http.post(`${this.addUsersApi}`, userData);
  }

}
