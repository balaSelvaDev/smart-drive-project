import { Component, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { UserService } from '../../../../core/services/admin-service/user-module/user.service';

@Component({
  selector: 'app-user-get',
  templateUrl: './user-get.component.html',
  styleUrl: './user-get.component.css'
})
export class UserGetComponent {

  constructor(private router: Router, private userService: UserService) { }

  navigateToAddUser() {
    this.router.navigate(['/admin/add-user']); // absolute navigation
  }

  users: any[] = [];
  totalItems = 0;
  pageSize = 5;
  currentPage = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.fetchUsers(this.currentPage, this.pageSize);
  }

  fetchUsers(page: number, size: number): void {
    this.userService.getUsers(page, size).subscribe(response => {
      console.log(response);
      this.users = response.content;
      this.totalItems = response.totalItems;
      this.currentPage = response.currentPage;
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.fetchUsers(this.currentPage, this.pageSize);
  }

  editUser(role: string, userId: number) {
    if (role === "ROLE_USER") {
      // Perform actions specific to ROLE_USER
      alert("Please carefull to edit, becuase you are trying to edit online user");
    }
    this.router.navigate(['/admin/edit-user', userId]); // pass ID in URL
  }

  deleteUser(role: string, userId: number) {
    if (role === "ROLE_USER") {
      // Perform actions specific to ROLE_USER
      alert("Please carefull to edit, becuase you are trying to edit online user");
    }
    if (confirm('Are you sure you want to delete this user?')) {
      console.log('Deleting user with ID:', userId);
      // TODO: call delete API
      this.userService.deleteUser(userId).subscribe(response => {
        console.log(response);
        this.reloadCurrentComponent();
      });
    }
  }
  reloadCurrentComponent() {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

}
