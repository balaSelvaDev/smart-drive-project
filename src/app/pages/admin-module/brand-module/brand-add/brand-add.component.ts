import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BrandService } from '../../../../core/services/admin-service/brand-master/brand.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-brand-add',
  templateUrl: './brand-add.component.html',
  styleUrl: './brand-add.component.css'
})
export class BrandAddComponent {

  brandForm!: FormGroup;

  constructor(private brandService: BrandService, private router: Router) { }

  ngOnInit(): void {
    this.brandForm = new FormGroup({
      brandName: new FormControl('', [Validators.required]),
      isActive: new FormControl(1, [Validators.required]),
    });
  }

  onSubmit(): void {
    if (this.brandForm.valid) {
      const payload = this.brandForm.value;
      this.brandService.addBrands(payload).subscribe({
        next: (res) => {
          console.log('Brand added successfully', res);
          this.router.navigate(['/admin/get-brand']); // Navigate to the brand list page
        },
        error: (err) => {
          console.error('Failed to add brand', err);
        },
      });
    } else {
      this.brandForm.markAllAsTouched(); // Highlight all errors
    }
  }

}
