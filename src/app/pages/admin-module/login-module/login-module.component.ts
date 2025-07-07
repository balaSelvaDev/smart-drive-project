import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../../../core/services/admin-service/login-module/login.service';

@Component({
  selector: 'app-login-module',
  templateUrl: './login-module.component.html',
  styleUrl: './login-module.component.css'
})
export class LoginModuleComponent {

  loginForm!: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private loginService: LoginService) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      emailId: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loginService.login(this.loginForm.value).subscribe({
        next: (response) => {
          console.log('Login successful:', response);
          localStorage.setItem('token', response.token);
          // Navigate to dashboard or home page
        },
        error: (err) => {
          console.error('Login failed:', err);
          this.errorMessage = 'Invalid email or password';
        },
      });
    }
  }

}
