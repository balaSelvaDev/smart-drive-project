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

  constructor(private http: HttpClient) { }

  login(credentials: LoginRequest): Observable<any> {
    return this.http.post<any>(this.apiUrl, credentials, {
      observe: 'response',
      responseType: 'json'
    });
  }

  setTokenCookie(token: string) {
    document.cookie = `jwt_token=${token}; path=/; max-age=86400; SameSite=Strict`;
  }

  getTokenFromCookie(): string | null {
    const match = document.cookie.match(new RegExp('(^| )jwt_token=([^;]+)'));
    return match ? match[2] : null;
  }

}
