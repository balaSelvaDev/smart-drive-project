import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface LoginRequest {
  emailId: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: any; // Replace `any` with actual user type if known
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private apiUrl = 'http://localhost:9090/api/login';

  constructor(private http: HttpClient) {}

  login(data: LoginRequest): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

}
