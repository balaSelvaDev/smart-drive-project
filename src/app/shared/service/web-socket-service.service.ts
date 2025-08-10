import { Injectable } from '@angular/core';
import { Client, Message } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Observable, Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginService } from '../../core/services/admin-service/login-module/login.service';


@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private stompClient: Client;
  private orderSubject = new Subject<any>();

  constructor(private snackBar: MatSnackBar, private authService: LoginService) {
    const user = this.authService.decodeToken();

    // Connect only if admin
    if (user?.roles?.includes('ROLE_ADMIN')) {
      this.stompClient = new Client({
        webSocketFactory: () => new SockJS('http://localhost:9090/ws'),
        reconnectDelay: 5000,
        onConnect: () => {
          this.stompClient.subscribe('/topic/admin-orders', (message: Message) => {
            const orderData = JSON.parse(message.body);
            this.orderSubject.next(orderData);
            this.show(`New order received: ${orderData.orderId}`);
            console.log("Admin notification:", orderData);
          });
        }
      });

      this.stompClient.activate();
    }
  }

  show(message: string, action: string = 'Close', duration: number = 4000) {
    this.snackBar.open(message, action, {
      duration,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: ['custom-snackbar'] // custom CSS for animation
    });
  }

  public getOrderNotifications(): Observable<any> {
    return this.orderSubject.asObservable();
  }
}
