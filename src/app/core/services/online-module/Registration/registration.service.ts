import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  private registrationApi = 'http://localhost:9090/api/users';
  private verificationCodeApi = 'http://localhost:9090/api/users/verification-code';
  private generatePasswordApi = "http://localhost:9090/api/users/generate-password";
  private resetVerificationCodeApi = "http://localhost:9090/api/users/reset-verification-code";
  private loginApi = "http://localhost:9090/api/login";

  constructor(private http: HttpClient) { }

  registration(userData: any): Observable<any> {
    return this.http.post(`${this.registrationApi}`, userData);
  }

  verificationCode(verificationCodeData: any): Observable<any> {
    return this.http.post(`${this.verificationCodeApi}`, verificationCodeData);
  }

  generatePassword(passwordData: any): Observable<any> {
    return this.http.post(`${this.generatePasswordApi}`, passwordData);
  }

  resetVerificationCode(userId: string, emailId: string): Observable<any> {
    return this.http.post(`${this.resetVerificationCodeApi}?userId=${userId}&emailId=${emailId}`, {});
  }

  login(loginData: any): Observable<any> {
    return this.http.post(`${this.loginApi}`, loginData);
  }

}
