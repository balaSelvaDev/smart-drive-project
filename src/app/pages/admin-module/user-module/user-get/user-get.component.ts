import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-get',
  templateUrl: './user-get.component.html',
  styleUrl: './user-get.component.css'
})
export class UserGetComponent {

  constructor(private router: Router) { }

  navigateToAddUser() {
    this.router.navigate(['/admin/add-user']); // absolute navigation
  }

}
