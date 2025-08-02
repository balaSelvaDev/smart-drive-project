import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import JwtDecode, { jwtDecode } from 'jwt-decode';

export interface LoginRequest {
  emailId: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: any; // Replace `any` with actual user type if known
}

export interface JwtPayload {
  sub: string;              // username or login identifier
  roles: string[];          // user roles
  iss: string;              // issuer of the token
  exp: number;              // expiry time (seconds since epoch)
  iat: number;              // issued at (seconds since epoch)
  userId: number;           // custom field from backend
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private apiUrl = 'http://localhost:9090/api/login/admin-login';

  constructor(private http: HttpClient, private router: Router) { }

  login(credentials: any): Observable<any> {
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

  decodeToken(): JwtPayload | null {
    const token = this.getTokenFromCookie();
    console.log(token);
    if (!token) return null;
    try {
      // console.log("abc: ", (jwtDecode<JwtPayload>(token)));
      return jwtDecode<JwtPayload>(token);
    } catch {
      return null;
    }
  }

  isLoggedIn(): boolean {
    const decoded = this.decodeToken();
    if (!decoded) return false;
    if (decoded.exp && Date.now() > decoded.exp * 1000) {
      this.logout();
      return false;
    }
    return true;
  }

  logout() {
    console.log("logout...")
    document.cookie = 'jwt_token=; path=/; max-age=0'; // remove cookie
    this.router.navigate(['/admin-login']);
  }

}
