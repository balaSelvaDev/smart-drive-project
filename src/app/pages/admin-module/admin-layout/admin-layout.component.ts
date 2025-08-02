import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { WebSocketService } from '../../../shared/service/web-socket-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';

import { JwtPayload, LoginService } from '../../../core/services/admin-service/login-module/login.service';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent {

  notifications: any[] = [];
  user: JwtPayload | null = null;
  roleDisplay: string = 'User';

  constructor(private router: Router,
    private wsService: WebSocketService,
    private snackBar: MatSnackBar, private loginService: LoginService
  ) { }

  ngOnInit(): void {
    this.wsService.getOrderNotifications().subscribe(data => {
      this.notifications.unshift(data);
    });
    if (!this.loginService.isLoggedIn()) {
      this.loginService.logout();
    } else {
      this.user = this.loginService.decodeToken();
      if (this.user?.roles?.length) {
        this.roleDisplay = this.mapRole(this.user.roles[0]);
      }
    }
  }
  
  mapRole(role: string): string {
    switch (role) {
      case 'ROLE_ADMIN':
        return 'Admin';
      case 'ROLE_USER':
        return 'User';
      case 'ROLE_MANAGER':
        return 'Manager';
      default:
        return role.replace('ROLE_', '').toLowerCase(); // fallback
    }
  }

  show(message: string, action: string = 'Close', duration: number = 4000) {
    this.snackBar.open(message, action, {
      duration,
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  // logout() {
  //   // Example logout logic
  //   localStorage.clear();
  //   window.location.href = '/login';
  // }




  logout() {
    this.loginService.logout();
  }

}
