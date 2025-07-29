import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-view-vehicle-details',
  templateUrl: './view-vehicle-details.component.html',
  styleUrl: './view-vehicle-details.component.css'
})
export class ViewVehicleDetailsComponent {

  vehicle: any;

  constructor(
    public dialogRef: MatDialogRef<ViewVehicleDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.vehicle = data; // ✅ assign received data to local variable
    console.log('Received Vehicle Data:', this.vehicle);
  }

  close(): void {
    this.dialogRef.close();
  }
}
