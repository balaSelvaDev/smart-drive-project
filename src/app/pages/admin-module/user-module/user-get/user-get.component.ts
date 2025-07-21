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

}
