import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TransactionService } from '../../../../core/services/admin-service/transaction/transaction.service';

@Component({
  selector: 'app-payment-popup',
  templateUrl: './payment-popup.component.html',
  styleUrl: './payment-popup.component.css'
})
export class PaymentPopupComponent {

  paymentForm!: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<PaymentPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private transactionService: TransactionService // passed booking data from table
  ) { }

  ngOnInit(): void {
    // const alreadyPaid = this.data.alreadyPaidAmount || 0;
    // const remainingAmount = Math.max(this.data.totalAmount - alreadyPaid, 0);
    console.log(this.data);
    this.paymentForm = new FormGroup({
      bookingId: new FormControl(this.data.bookingId, Validators.required),
      userId: new FormControl(this.data.userId, Validators.required),
      paymentMode: new FormControl("UPI", Validators.required),
      totalAmount: new FormControl(this.data.totalAmount, [Validators.required, Validators.min(0)]),
      paidAmount: new FormControl(null, [Validators.required, Validators.min(0)]),
      pendingAmount: new FormControl(this.data.pendingAmt)
    });

    // Watch paidAmount changes
    this.paymentForm.get('paidAmount')?.valueChanges.subscribe((paid: number) => {
      // const total = this.paymentForm.get('totalAmount')?.value || 0;
      // const alreadyPaid = this.data.alreadyPaidAmount || 0;
      // const totalRemaining = Math.max(total - alreadyPaid, 0);

      // if (paid > totalRemaining) {
      //   this.paymentForm.get('paidAmount')?.setErrors({ exceedTotal: true });
      // }

      // const pending = Math.max(totalRemaining - (paid || 0), 0);
      // this.paymentForm.get('pendingAmount')?.setValue(pending);
    });
  }

  submit(): void {
    if (this.paymentForm.valid) {
      // const payload = this.paymentForm.value;
      const data = {
        "bookingId": this.paymentForm.controls['bookingId'].value,
        "userId": this.paymentForm.controls['userId'].value,
        "paymentMode": this.paymentForm.controls['paymentMode'].value,
        "totalAmount": this.paymentForm.controls['totalAmount'].value,
        "paidAmount": this.paymentForm.controls['paidAmount'].value,
        "pendingAmount": this.paymentForm.controls['pendingAmount'].value,
        "paymentReference": this.data.bookingReference
      }
      this.transactionService.addBookingAmt(data).subscribe({
        next: (res) => {
          console.log('Brand added successfully', res);
          this.dialogRef.close(this.paymentForm.getRawValue());
        },
        error: (err) => {
          console.error('Failed to add brand', err);
        },
      });
    } else {
      this.paymentForm.markAllAsTouched(); // Highlight all errors
    }
    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      return;
    }
  }

  close(): void {
    this.dialogRef.close();
  }

}
