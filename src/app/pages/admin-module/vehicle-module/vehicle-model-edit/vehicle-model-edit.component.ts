import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { VehicleModelService } from '../../../../core/services/admin-service/vehicle-model/vehicle-model.service';
import { catchError, debounceTime, distinctUntilChanged, map, Observable, of, startWith, switchMap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { VehicleModelAddRequest } from '../../../../core/models/interface/vehicle-model-add-request.model';

@Component({
  selector: 'app-vehicle-model-edit',
  templateUrl: './vehicle-model-edit.component.html',
  styleUrl: './vehicle-model-edit.component.css'
})
export class VehicleModelEditComponent {
  searchControl = new FormControl('');
  filteredOptions: any[] = [];
  vehicleModelForm!: FormGroup;
  displayBrand: any;

  vehicleModelId!: number;
  statusControl = new FormControl(1); // default Active (1)

  constructor(private vehicleModelService: VehicleModelService, private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.vehicleModelForm = new FormGroup({
      brandId: new FormControl('', [Validators.required]),
      vehicleModelName: new FormControl('', [Validators.required]),
    });

    this.vehicleModelId = +this.route.snapshot.paramMap.get('vehicleModelId')!;
    if (this.vehicleModelId !== 0) {
      // Fetch brand from backend using brandId
      console.log('Loading brand with ID:', this.vehicleModelId);
      this.vehicleModelService.getVehicleModelById(this.vehicleModelId).subscribe({
        next: (res) => {
          console.log('Brand added successfully', res);
          this.vehicleModelForm.controls["vehicleModelName"].setValue(res.modelName);
          this.setValue(res.brandOnlyDTO);
          this.setStatus(res.isActive);
        },
        error: (err) => {
          console.error('Failed to add brand', err);
        },
      });
    }

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

  }

  onSubmit(): void {
    if (this.vehicleModelForm.valid) {
      const payload = this.vehicleModelForm.value;
      console.log('Form submitted with payload:', payload);
      // payload.brandId = this.vehicleModelForm.get('brandId')?.value.brandId;

      const payload11: any = {
        modelName: payload.vehicleModelName,
        brandId: payload.brandId, // extract only the number
        isActive: this.statusControl.value
      };
      console.log(payload11)

      this.vehicleModelService.updateVehicleModel(Number(this.vehicleModelId), payload11).subscribe({
        next: (res) => {
          console.log('Vehicle model added successfully', res);
          this.router.navigate(['/admin/get-vehicle-model']); // Navigate to the vehicle model list page
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

  setStatus(value: number) {
    this.statusControl.setValue(value);
  }

}
