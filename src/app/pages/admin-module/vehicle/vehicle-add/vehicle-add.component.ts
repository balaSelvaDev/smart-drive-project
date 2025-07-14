import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vehicle-add',
  templateUrl: './vehicle-add.component.html',
  styleUrl: './vehicle-add.component.css'
})
export class VehicleAddComponent {

  vehicleForm!: FormGroup;

  constructor(private router: Router,
    private fb: FormBuilder, private http: HttpClient) {

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
    }

}
