import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  private addBookingAmtApi = 'http://localhost:9090/api/booking-amt';

  constructor(private http: HttpClient) { }

  addBookingAmt(bookingAmtData: any): Observable<any> {
    return this.http.post(`${this.addBookingAmtApi}`, bookingAmtData);
  }
}
