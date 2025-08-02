import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../../../core/services/admin-service/login-module/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-module',
  templateUrl: './login-module.component.html',
  styleUrl: './login-module.component.css'
})
export class LoginModuleComponent {

  loginForm!: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private loginService: LoginService, private router: Router) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      emailId: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      authProvider: ["ROLE_ADMIN"]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loginService.login(this.loginForm.value).subscribe({
        next: (response) => {
          // console.log('Login successful:', response);
          // localStorage.setItem('token', response.token);
          const authHeader = response.headers.get('Authorization');
          console.log('Authorization header:', authHeader);
          if (authHeader) {
            const token = authHeader.replace('Bearer ', '');
            this.loginService.setTokenCookie(token);
            console.log('JWT saved in cookie');
            this.router.navigate(['/admin']); // absolute navigation
          } else {
            console.log('Authorization header not found or malformed');
          }

        },
        error: (err) => {
          console.error('Login failed:', err);
          this.errorMessage = 'Invalid email or password';
        },
      });
    }
  }

}
