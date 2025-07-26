import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginService } from '../services/admin-service/login-module/login.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private loginService: LoginService) { }

    
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = this.loginService.getTokenFromCookie(); // reads from document.cookie
        if (token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}` // ✅ add token to header
                }
            });
        }
        console.log('Request intercepted:', request);
        return next.handle(request);
    }
}