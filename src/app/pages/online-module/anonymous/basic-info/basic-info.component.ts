import { Component } from '@angular/core';
import { UserService } from '../../../../core/services/admin-service/user-module/user.service';
import { Route, Router } from '@angular/router';
import { AuthServiceService } from '../../../../shared/service/auth-service.service';

@Component({
  selector: 'app-basic-info',
  templateUrl: './basic-info.component.html',
  styleUrl: './basic-info.component.css'
})
export class BasicInfoComponent {

  user: any = null;
  userResult: any = null;

  constructor(
    private userService: UserService, private router: Router,
    public authService: AuthServiceService
  ) { }

  ngOnInit(): void {
    this.authService.user$.subscribe(u => {
      this.user = u;
      console.log(this.user)
    });
    if(this.user.userId) {
      this.fetchUser(this.user.userId);
    }
    // this.wsService.getOrderNotifications().subscribe(data => {
    //   this.notifications.unshift(data);
    // });
  }

  // user = {
  //   firstName: 'Amelia',
  //   lastName: 'Harper',
  //   email: 'amelia.harper@example.com',
  //   phone: '+91 9876543210',
  //   id: 22,
  //   profilePic: 'https://randomuser.me/api/portraits/women/44.jpg'
  // };

  changePassword() {
    alert('Change Password clicked!');
  }

  fetchUser(userId: number): void {
    this.userService.getUsersForCustomer(userId).subscribe(response => {
      console.log(response);
      this.userResult = response;
    });
  }

}
