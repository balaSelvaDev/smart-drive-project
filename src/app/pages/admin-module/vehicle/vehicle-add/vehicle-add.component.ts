import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, debounceTime, distinctUntilChanged, of, startWith, switchMap } from 'rxjs';
import { VehicleService } from '../../../../core/services/admin-service/vehicle-module/vehicle.service';
import { VehicleAddRequestDTO } from '../../../../core/models/classes/vehicle/vehicle-add-request-dto';

@Component({
  selector: 'app-vehicle-add',
  templateUrl: './vehicle-add.component.html',
  styleUrl: './vehicle-add.component.css'
})
export class VehicleAddComponent {

  vehicleForm!: FormGroup;

  brandNameSearchControl = new FormControl('');
  brandNameFilteredOptions: any[] = [];

  vehicleModelSearchControl = new FormControl('');
  vehicleModelFilteredOptions: any[] = [];

  constructor(private router: Router,
    private fb: FormBuilder, private http: HttpClient,
    private vehicleService: VehicleService) {

  }
  ngOnInit(): void {
    this.vehicleForm = new FormGroup({
      brandId: new FormControl(null, Validators.required),
      vehicleName: new FormControl('', Validators.required), // You missed this
      modelId: new FormControl(null, Validators.required),
      description: new FormControl(''),
      registrationNo: new FormControl('', Validators.required),
      pricePerKm: new FormControl(null, [Validators.required, Validators.min(0)]),
      fuelType: new FormControl('Petrol', Validators.required), // Make sure enum is respected

      fuelCapacity: new FormControl(null),
      mileagePerLitre: new FormControl(null),
      seatingCapacity: new FormControl(null),
      color: new FormControl(''),

      vehicleType: new FormControl('Hatchback', Validators.required), // enum again
      ownerType: new FormControl('First', Validators.required), // enum

      yearOfManufacture: new FormControl(null),
      engineCc: new FormControl(null),
      torque: new FormControl(''),
      horsepower: new FormControl(null),

      isInsured: new FormControl(false),
      insuranceExpiryDate: new FormControl(null), // Must be formatted before sending
      lastUpdatedInsuranceDate: new FormControl(null),

      hasAirbags: new FormControl(false),
      hasAbs: new FormControl(false),
      hasSunroof: new FormControl(false),
      hasGps: new FormControl(false),
      hasMusicSystem: new FormControl(false),
      hasReverseCamera: new FormControl(false)
    });
    //
    this.brandNameSearchControl.valueChanges
      .pipe(
        startWith(''),
        debounceTime(1000), // 1 second debounce
        distinctUntilChanged(),
        switchMap((value) => {
          const safeValue = value ?? ''; // if null, fallback to empty string
          return this.vehicleService.searchBrandName(safeValue).pipe(
            catchError(() => of([]))
          );
        })
      )
      .subscribe((results) => {
        this.brandNameFilteredOptions = results.slice(0, 6); // limit to 6
        console.log('Filtered options:', this.brandNameFilteredOptions);
      });
  }
  setBrandIdInForm(item: any) {
    if (!item) return;
    this.vehicleForm.get('brandId')?.setValue(item.brandId);
    console.log('Selected brand:', item.brandId);
    // this.displayUserName = item.userName;
    this.brandNameSearchControl.setValue(item.brandName, { emitEvent: false });  // Prevent triggering valueChanges
    this.brandNameFilteredOptions = []; // Clear the options after selection
    console.log('Selected brand:', item.brandName);
    this.vehicleModelFilteredOptions = item.vehicleModelIdNameDTO;
    this.vehicleForm.controls['modelId'].setValue("");

  }

  setVehicleModelIdInForm(item: any) {
    if (!item) return;
    this.vehicleForm.get('modelId')?.setValue(item.vehicleModelId);
    console.log('Selected vehicle model:', item.vehicleModelId);
    // this.displayUserName = item.userName;
    this.vehicleModelSearchControl.setValue(item.vehicleModelName, { emitEvent: false });  // Prevent triggering valueChanges
    this.vehicleModelFilteredOptions = []; // Clear the options after selection
    console.log('Selected vehicle:', item.vehicleModelName);
    // this.vehicleForm.controls['brandName'].setValue(item.brandName);
    // this.vehicleForm.controls['vehicleModelName'].setValue(item.vehicleModelName);
  }

  onSubmit(): void {
    const payload = this.vehicleForm.value;
    console.log('Form submitted with payload:', payload);
    if (this.vehicleForm.valid) {

      console.log('Form submitted with payload:', payload);
      const vehicleAddRequest: VehicleAddRequestDTO = {
        ...payload,
        fuelType: payload.fuelType,
        vehicleType: payload.vehicleType,
        ownerType: payload.ownerType,
        insuranceExpiryDate: new Date(payload.insuranceExpiryDate).toISOString(),
        lastUpdatedInsuranceDate: new Date(payload.lastUpdatedInsuranceDate).toISOString(),
      };
      console.log('Vehicle Add Request DTO:', vehicleAddRequest);
      this.vehicleService.addVehicle(vehicleAddRequest).subscribe({
        next: (res) => {
          console.log('Vehicle added successfully', res);
          this.router.navigate(['/admin/get-vehicle']);
        },
        error: (err) => {
          console.error('Failed to add vehicle', err);
        },
      });
    } else {
      Object.keys(this.vehicleForm.controls).forEach(key => {
        const control = this.vehicleForm.get(key);

        if (control && control.invalid) {
          console.log(`Field '${key}' is invalid. Errors:`, control.errors);
        }
      });
      this.vehicleForm.markAllAsTouched();

    }
  }

}
