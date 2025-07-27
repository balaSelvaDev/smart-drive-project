import { Component, Inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RegistrationService } from '../../../../core/services/online-module/Registration/registration.service';

@Component({
  selector: 'app-customer-login-popup',
  templateUrl: './customer-login-popup.component.html',
  styleUrl: './customer-login-popup.component.css'
})
export class CustomerLoginPopupComponent {

  registrationForm!: FormGroup;

  verificationForm!: FormGroup;

  loginForm!: FormGroup;

  passwordForm!: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;

  isRegistrationSectionVisible: boolean = true;
  isRegistrationVerificationSectionVisible: boolean = false;
  isPasswordSectionVisible: boolean = false;
  isLoginSectionVisible: boolean = false;
  registrationResponse: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CustomerLoginPopupComponent>,
    private router: Router,
    private registrationService: RegistrationService
  ) { }

  ngOnInit(): void {
    this.registrationForm = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      phoneNumber: new FormControl('', [Validators.required]),
    });
    this.verificationForm = new FormGroup({
      uuid: new FormControl('', [Validators.required]),
      code: new FormControl('', [Validators.required]),
      emailId: new FormControl('', [Validators.required]),
      userId: new FormControl('', [Validators.required])
    });
    this.passwordForm = new FormGroup({
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[0-9])(?=.*[!@#$%^&*])/)
      ]),
      confirmPassword: new FormControl('', Validators.required),
      uuid: new FormControl('', [Validators.required]),
      emailId: new FormControl('', [Validators.required]),
      userId: new FormControl('', [Validators.required])
    }, { validators: this.passwordMatchValidator });
    this.loginForm = new FormGroup({
      emailId: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }

  onSubmit(): void {
    if (this.registrationForm.valid) {
      const payload = this.registrationForm.value;
      this.registrationService.registration(payload).subscribe({
        next: (res) => {
          console.log('Registration successful', res);
          this.isRegistrationSectionVisible = false;
          this.isRegistrationVerificationSectionVisible = true;
          this.isPasswordSectionVisible = false;
          this.isLoginSectionVisible = false; // Hide login section after registration
          this.registrationResponse = res; // Store the result for verification
          this.verificationForm.controls['emailId'].setValue(res.emailId);
          this.verificationForm.controls['uuid'].setValue(res.uuid);
          this.verificationForm.controls['userId'].setValue(res.userId);
          this.startCountdown(); // Start the countdown timer
          // Optionally, navigate to another page or show a success message
        },
        error: (err) => {
          console.error('Failed to register', err);
        },
      });
    } else {
      this.registrationForm.markAllAsTouched(); // Highlight all errors
    }
  }
  onSubmitVerification(): void {
    if (this.verificationForm.valid) {
      const payload = this.verificationForm.value;
      this.registrationService.verificationCode(payload).subscribe({
        next: (res) => {
          console.log('Verification successful', res);
          this.isRegistrationSectionVisible = false;
          this.isRegistrationVerificationSectionVisible = false;
          this.isLoginSectionVisible = false; // Hide login section after verification
          this.isPasswordSectionVisible = true;
          this.passwordForm.controls['emailId'].setValue(res.emailId);
          this.passwordForm.controls['uuid'].setValue(res.uuid);
          this.passwordForm.controls['userId'].setValue(res.userId);
          // this.dialogRef.close();
        },
        error: (err) => {
          console.error('Failed to verify', err);
        },
      });
    } else {
      this.verificationForm.markAllAsTouched(); // Highlight all errors
    }
  }
  // onSubmitPassword(): void {
  //   if (this.passwordForm.valid) {
  //     const payload = this.passwordForm.value;
  //     this.registrationService.generatePassword(payload).subscribe({
  //       next: (res) => {
  //         console.log('Password set successfully', res);
  //         alert('Password set successfully! You can now log in.');
  //       },
  //       error: (err) => {
  //         console.error('Failed to set password', err);
  //       },
  //     });
  //   } else {
  //     this.passwordForm.markAllAsTouched(); // Highlight all errors
  //   }
  // }

  // closeDialog() {
  //   this.dialogRef.close();
  // }

  changeToVerification() {
    this.isRegistrationSectionVisible = false;
    this.isRegistrationVerificationSectionVisible = true;
  }

  changeToPassword() {
    this.isRegistrationSectionVisible = false;
    this.isRegistrationVerificationSectionVisible = false;
    this.isPasswordSectionVisible = true;
  }

  public timeLeft: number = 120; // 2 minutes in seconds (120)
  private interval: any;
  public isTimerFinished: boolean = false; // Flag to check if time is finished

  ngOnDestroy(): void {
    // Clear the interval when component is destroyed to avoid memory leaks
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  private startCountdown(): void {
    this.isTimerFinished = false; // Reset the flag to false when the timer starts
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.isTimerFinished = true; // Mark timer as finished
        clearInterval(this.interval);
        console.log('Time is up!');
      }
    }, 1000); // Update every second (1000 ms)
  }

  // Function to format time in mm:ss format
  get formattedTime(): string {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    return `${this.padNumber(minutes)}:${this.padNumber(seconds)}`;
  }

  // Helper to pad numbers to 2 digits (e.g., 5 -> 05)
  private padNumber(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }

  // Function to reset the timer
  resetTimer(): void {
    this.registrationService.resetVerificationCode(this.registrationResponse.userId, this.registrationResponse.emailId).subscribe({
      next: (res) => {
        console.log('Password set successfully', res);
        alert('Password set successfully! You can now log in.');
        this.verificationForm.controls['emailId'].setValue(res.emailId);
        this.verificationForm.controls['uuid'].setValue(res.uuid);
        this.verificationForm.controls['userId'].setValue(res.userId);
        this.timeLeft = 120; // Reset to 2 minutes
        this.startCountdown(); // Start the countdown again
      },
      error: (err) => {
        console.error('Failed to set password', err);
      },
    });
  }

  // function to handle password mismatch and show error --------->
  // Password match custom validator
  passwordMatchValidator(form: AbstractControl): { [key: string]: any } | null {
    const password = form.get('password')?.value;
    const confirm = form.get('confirmPassword')?.value;
    return password === confirm ? null : { mismatch: true };
  }

  // On submit
  onSubmitPassword(): void {
    if (this.passwordForm.valid) {
      console.log("Password submitted:", this.passwordForm.value.password);
      // Call backend API here
      const payload = this.passwordForm.value;
      this.registrationService.generatePassword(payload).subscribe({
        next: (res) => {
          console.log('Password set successfully', res);
          alert('Password set successfully! You can now log in.');
        },
        error: (err) => {
          console.error('Failed to set password', err);
        },
      });
    } else {
      this.passwordForm.markAllAsTouched();
    }
  }

  closeDialog(): void {
    // Close dialog or redirect
    this.dialogRef.close();
  }

  // Helpers
  get password(): AbstractControl | null {
    return this.passwordForm.get('password');
  }

  get confirmPassword(): AbstractControl | null {
    return this.passwordForm.get('confirmPassword');
  }

  // 
  openLogin(): void {
    this.isRegistrationSectionVisible = false;
    this.isRegistrationVerificationSectionVisible = false;
    this.isPasswordSectionVisible = false;
    this.isLoginSectionVisible = true; // Show login section
  }

  onSubmitLogin(): void {
    if (this.loginForm.valid) {
      console.log("Login submitted:", this.loginForm.value);
      // Call backend API here
      const payload = this.loginForm.value;
      this.registrationService.login(payload).subscribe({
        next: (res) => {
          console.log('Login successful', res);
          alert('Login successful! Welcome back.');
        },
        error: (err) => {
          console.error('Failed to log in', err);
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
