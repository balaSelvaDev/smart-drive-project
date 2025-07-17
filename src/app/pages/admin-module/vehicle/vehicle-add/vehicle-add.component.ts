import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, debounceTime, distinctUntilChanged, of, startWith, switchMap } from 'rxjs';
import { VehicleService } from '../../../../core/services/admin-service/vehicle-module/vehicle.service';

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
      brandId: new FormControl('', [Validators.required]),
      modelId: new FormControl(''),
      description: new FormControl(''),
      registrationNo: new FormControl(''),
      pricePerKm: new FormControl(''),
      fuelType: new FormControl('Petrol'),

      fuelCapacity: new FormControl(''),
      mileagePerLitre: new FormControl(''),
      seatingCapacity: new FormControl(''),
      color: new FormControl(''),
      vehicleType: new FormControl(''),

      ownerType: new FormControl('First'),
      yearOfManufacture: new FormControl(''),
      engineCc: new FormControl(''),
      torque: new FormControl(''),
      horsepower: new FormControl(''),

      isInsured: new FormControl(''),
      insuranceExpiryDate: new FormControl(''),
      lastUpdatedInsuranceDate: new FormControl(''),
      hasAirbags: new FormControl(''),
      hasAbs: new FormControl(''),

      hasSunroof: new FormControl(''),
      hasGps: new FormControl(''),
      hasMusicSystem: new FormControl(''),
      hasReverseCamera: new FormControl('')
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

}
