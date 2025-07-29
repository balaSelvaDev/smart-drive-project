import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-view-user-deatils',
  templateUrl: './view-user-deatils.component.html',
  styleUrl: './view-user-deatils.component.css'
})
export class ViewUserDeatilsComponent {

  user: any;

  constructor(
    public dialogRef: MatDialogRef<ViewUserDeatilsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.user = data;
    console.log('Received User Data:', this.user);
  }

  close(): void {
    this.dialogRef.close();
  }

}
