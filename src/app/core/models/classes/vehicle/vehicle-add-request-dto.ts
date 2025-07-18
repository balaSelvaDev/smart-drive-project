export class VehicleAddRequestDTO {

    vehicleName: string = '';
    modelId: number = 0;
    description: string = '';
    registrationNo: string = '';
    pricePerKm: number = 0;
    fuelType: 'PETROL' | 'DIESEL' | 'ELECTRIC' | 'HYBRID' = 'PETROL';
    fuelCapacity: number = 0;
    mileagePerLitre: number = 0;
    seatingCapacity: number = 0;
    color: string = '';
    vehicleType: 'SUV' | 'SEDAN' | 'HATCHBACK' | 'TRUCK' = 'SEDAN';
    ownerType: 'FIRST' | 'SECOND' | 'THIRD' = 'FIRST';
    yearOfManufacture: number = new Date().getFullYear();
    engineCc: number = 0;
    torque: string = '';
    horsepower: number = 0;
    isInsured: boolean = false;
    insuranceExpiryDate: string = '';
    lastUpdatedInsuranceDate: string = '';
    hasAirbags: boolean = false;
    hasAbs: boolean = false;
    hasSunroof: boolean = false;
    hasGps: boolean = false;
    hasMusicSystem: boolean = false;
    hasReverseCamera: boolean = false;

}
