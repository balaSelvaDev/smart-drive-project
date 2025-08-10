import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-payment-popup',
  templateUrl: './payment-popup.component.html',
  styleUrl: './payment-popup.component.css'
})
export class PaymentPopupComponent {

  paymentForm!: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<PaymentPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any // passed booking data from table
  ) {}

  ngOnInit(): void {
    const alreadyPaid = this.data.alreadyPaidAmount || 0;
    const remainingAmount = Math.max(this.data.totalAmount - alreadyPaid, 0);

    this.paymentForm = new FormGroup({
      bookingId: new FormControl(this.data.bookingId, Validators.required),
      userId: new FormControl(this.data.userId, Validators.required),
      paymentMode: new FormControl(null, Validators.required),
      totalAmount: new FormControl(this.data.totalAmount, [Validators.required, Validators.min(0)]),
      paidAmount: new FormControl(null, [Validators.required, Validators.min(0)]),
      pendingAmount: new FormControl(remainingAmount)
    });

    // Watch paidAmount changes
    this.paymentForm.get('paidAmount')?.valueChanges.subscribe((paid: number) => {
      const total = this.paymentForm.get('totalAmount')?.value || 0;
      const alreadyPaid = this.data.alreadyPaidAmount || 0;
      const totalRemaining = Math.max(total - alreadyPaid, 0);

      if (paid > totalRemaining) {
        this.paymentForm.get('paidAmount')?.setErrors({ exceedTotal: true });
      }

      const pending = Math.max(totalRemaining - (paid || 0), 0);
      this.paymentForm.get('pendingAmount')?.setValue(pending);
    });
  }

  submit(): void {
    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      return;
    }
    this.dialogRef.close(this.paymentForm.getRawValue());
  }

  close(): void {
    this.dialogRef.close();
  }

}
