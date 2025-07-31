import { Injectable } from '@angular/core';
import { Client, Message } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Observable, Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private stompClient: Client;
  private orderSubject = new Subject<any>();

  constructor(private snackBar: MatSnackBar) {
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS('http://localhost:9090/ws'), // ✅ only one `/ws`
      reconnectDelay: 5000,
      onConnect: () => {
        // ✅ Use STOMP destination, not full URL
        this.stompClient.subscribe('/topic/admin-orders', (message: Message) => {
          this.orderSubject.next(JSON.parse(message.body));
          const orderData = JSON.parse(message.body);
          this.show(`New order received: ${orderData.orderId}`);
          console.log("showing....", orderData);
        });
      }
    });

    this.stompClient.activate();
  }
  show(message: string, action: string = 'Close', duration: number = 4000) {
    this.snackBar.open(message, action, {
      duration,
      horizontalPosition: 'right',
      verticalPosition: 'bottom'
    });
  }

  public getOrderNotifications(): Observable<any> {
    return this.orderSubject.asObservable();
  }
}
