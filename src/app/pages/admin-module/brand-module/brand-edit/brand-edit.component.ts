import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BrandService } from '../../../../core/services/admin-service/brand-master/brand.service';

@Component({
  selector: 'app-brand-edit',
  templateUrl: './brand-edit.component.html',
  styleUrl: './brand-edit.component.css'
})
export class BrandEditComponent {

  brandId!: number;
  statusControl = new FormControl(1); // default Active (1)

  brandForm = new FormGroup({
    brandName: new FormControl('', [Validators.required]),
    isActive: new FormControl(1, [Validators.required]),
  });

  constructor(private brandService: BrandService, private route: ActivatedRoute, public router: Router) { }

  ngOnInit(): void {
    this.brandId = +this.route.snapshot.paramMap.get('brandId')!;

    if (this.brandId !== 0) {
      // Fetch brand from backend using brandId
      console.log('Loading brand with ID:', this.brandId);
    }
    this.brandService.getBrandsById(this.brandId).subscribe({
      next: (res) => {
        console.log('Brand added successfully', res);
        this.brandForm.controls["brandName"].setValue(res.brandName);
        this.setStatus(res.isActive);
      },
      error: (err) => {
        console.error('Failed to add brand', err);
      },
    });
  }

  onSubmit(): void {
    if (this.brandForm.valid) {
      const payload = {
        brandId: this.brandId,
        brandName: this.brandForm.get('brandName')?.value,
        isActive: this.statusControl.value
      };
      this.brandService.updateBrands(payload).subscribe({
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

  setStatus(value: number) {
    this.statusControl.setValue(value);
  }


}
