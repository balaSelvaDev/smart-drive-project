import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { VehicleModelService } from '../../../../core/services/admin-service/vehicle-model/vehicle-model.service';
import { catchError, debounceTime, distinctUntilChanged, map, Observable, of, startWith, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { VehicleModelAddRequest } from '../../../../core/models/interface/vehicle-model-add-request.model';

@Component({
  selector: 'app-vehicle-model-add',
  templateUrl: './vehicle-model-add.component.html',
  styleUrl: './vehicle-model-add.component.css'
})
export class VehicleModelAddComponent implements OnInit {

  searchControl = new FormControl('');
  filteredOptions: any[] = [];
  vehicleModelForm!: FormGroup;
  displayBrand: any;

  constructor(private vehicleModelService: VehicleModelService, private router: Router) { }

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        startWith(''),
        debounceTime(1000), // 1 second debounce
        distinctUntilChanged(),
        switchMap((value) => {
          const safeValue = value ?? ''; // if null, fallback to empty string
          return this.vehicleModelService.searchItems(safeValue).pipe(
            catchError(() => of([]))
          );
        })
      )
      .subscribe((results) => {
        this.filteredOptions = results.slice(0, 6); // limit to 6
        console.log('Filtered options:', this.filteredOptions);
      });
    this.vehicleModelForm = new FormGroup({
      brandId: new FormControl('', [Validators.required]),
      vehicleModelName: new FormControl('', [Validators.required]),
    });
  }

  onSubmit(): void {
    if (this.vehicleModelForm.valid) {
      const payload = this.vehicleModelForm.value;
      console.log('Form submitted with payload:', payload);
      // payload.brandId = this.vehicleModelForm.get('brandId')?.value.brandId;

      const payload11: VehicleModelAddRequest = {
        modelName: payload.vehicleModelName,
        brandId: payload.brandId // extract only the number
      };

      this.vehicleModelService.addVehicleModel(payload11).subscribe({
        next: (res) => {
          console.log('Vehicle model added successfully', res);
          this.router.navigate(['/get-vehicle-model']); // Navigate to the vehicle model list page
        },
        error: (err) => {
          console.error('Failed to add vehicle model', err);
        },
      });
    } else {
      this.vehicleModelForm.markAllAsTouched(); // Highlight all errors
    }
  }
  onBrandSelected(selectedBrand: any) {
    this.vehicleModelForm.get('brandId')?.setValue(selectedBrand);
  }
  setValue(item: any) {
    this.vehicleModelForm.get('brandId')?.setValue(item.brandId);
    this.displayBrand = item.brandName;
    this.searchControl.setValue(item.brandName, { emitEvent: false });  // Prevent triggering valueChanges
    this.filteredOptions = []; // Clear the options after selection
    console.log('Selected brand:', item.brandName);
  }

}
