import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  sub: string;
  roles: string[];
  userId: number;
  iat: number;
  exp: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  private userSubject = new BehaviorSubject<DecodedToken | null>(null);
  user$ = this.userSubject.asObservable();

  constructor() {
    const token = localStorage.getItem('jwt');
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        this.userSubject.next(decoded);
      } catch (e) {
        console.error('Invalid token:', e);
      }
    }
  }

  setUser(token: string) {
    localStorage.setItem('jwt', token);
    const decoded = jwtDecode<DecodedToken>(token);
    this.userSubject.next(decoded);
  }

  logout() {
    localStorage.removeItem('jwt');
    this.userSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('jwt');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
