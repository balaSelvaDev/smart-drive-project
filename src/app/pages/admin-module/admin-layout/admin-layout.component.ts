import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { WebSocketService } from '../../../shared/service/web-socket-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent {

  notifications: any[] = [];

  constructor(private router: Router,
    private wsService: WebSocketService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.wsService.getOrderNotifications().subscribe(data => {
      this.notifications.unshift(data);
    });
  }
  show(message: string, action: string = 'Close', duration: number = 4000) {
    this.snackBar.open(message, action, {
      duration,
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

}
