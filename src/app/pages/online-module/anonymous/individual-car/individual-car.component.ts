import { Component, HostListener } from '@angular/core';
import { AnonymousService } from '../../../../core/services/online-module/anonymous/anonymous.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewBookingPriceComponent } from '../view-booking-price/view-booking-price.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-individual-car',
  templateUrl: './individual-car.component.html',
  styleUrl: './individual-car.component.css'
})
export class IndividualCarComponent {

  images: string[] = [
    // 'https://zoomcar-assets.zoomcar.com/599937/HostCarImage/mini_magick20241205-3999-1gam6tz6a47cdc4-f2d8-4cd4-983b-c178c224a23d.jpeg',
    // 'https://zoomcar-assets.zoomcar.com/599941/HostCarImage/host_car_image_59994170b5a10a-ce8e-4d3c-a8b3-5351a4830f5620240716-30-1wilyj.jpg',
    // 'https://zoomcar-assets.zoomcar.com/599942/HostCarImage/host_car_image_599942f951a660-bde3-4640-af6e-421e4f31284520240716-36-1hpyxs3.jpg',
    // 'https://zoomcar-assets.zoomcar.com/599939/HostCarImage/mini_magick20241205-3999-bsh5k0cbbe8352-5f6c-41bf-93cb-d8ff74d2ea96.jpeg',
    // 'https://zoomcar-assets.zoomcar.com/599937/HostCarImage/mini_magick20241205-3999-1gam6tz6a47cdc4-f2d8-4cd4-983b-c178c224a23d.jpeg',
    // 'https://zoomcar-assets.zoomcar.com/1130715/HostCarImage/mini_magick20250703-1-1b0em7cc8cacda6-2670-4f72-bb98-3ff897edbf15.jpeg',
  ];
  vehicle: any = {};

  distance: string = '';
  duration: string = '';

  distanceLoaded: boolean = false;

  vehicleId!: number;

  constructor(private anonymousService: AnonymousService, private route: ActivatedRoute, private router: Router, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.vehicleId = +this.route.snapshot.paramMap.get('id')!;
    if(this.vehicleId !== 0) {
      this.fetchVehicleById(this.vehicleId.toString());
    }
  }

  currentIndex = 0;
  isViewerOpen = false;

  tripAmt: number = 0;
  convenienceFee: number = 0;
  refundableAmount: number = 0;
  totalAmt: number = 0;

  openViewer(index: number) {
    this.currentIndex = index;
    this.isViewerOpen = true;
  }

  closeViewer() {
    this.isViewerOpen = false;
  }

  prevImage() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  nextImage() {
    if (this.currentIndex < this.images.length - 1) {
      this.currentIndex++;
    }
  }

  // 🔑 Handle keyboard events
  @HostListener('window:keydown', ['$event'])
  handleKeyboard(event: KeyboardEvent) {
    if (!this.isViewerOpen) return;

    switch (event.key) {
      case 'ArrowLeft':
        this.prevImage();
        break;
      case 'ArrowRight':
        this.nextImage();
        break;
      case 'Escape':
        this.closeViewer();
        break;
    }
  }

  fetchVehicleById(id: string): void {
    this.anonymousService.getVehicleById(id).subscribe(response => {
      console.log(response);
      this.vehicle = response;
      console.log('Vehicle details fetched successfully:', response.vehicleImagesList);
      this.getDistance(this.vehicle.clientLocation.locationName, 'Old bus stand, Rajapalayam');

      response.vehicleImagesList.forEach((image: any) => {
        this.images.push(image.imageUrl);
      });
    });
  }

  navigateToClientLocation(location: string) {
    window.open(location, '_blank');
  }


  //
  openDialog() {
    const myObject = {
      name: 'John Doe',
      age: 30,
      location: 'Chennai'
    };

    this.dialog.open(ViewBookingPriceComponent, {
      width: '400px',
      data: myObject,
      panelClass: 'custom-dialog-container'
    });
  }

  //


  distanceInKm: number = 0;
  fuelEstimate: number = 0;
  getDistance(origin1: string, destination1: string): void {
    const origin = origin1;
    const destination = destination1;

    const service = new google.maps.DistanceMatrixService();

    service.getDistanceMatrix(
      {
        origins: [origin],
        destinations: [destination],
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
      },
      (response, status) => {
        if (
          status === 'OK' &&
          response &&
          response.rows?.[0]?.elements?.[0]
        ) {
          const element = response.rows[0].elements[0];
          this.distance = element.distance?.text || 'N/A';
          this.duration = element.duration?.text || 'N/A';

          // Extract numeric distance from "2.3 km"
          const km = parseFloat(element.distance?.text.replace(' km', '') || '0');
          this.distanceInKm = km;

          // Assume mileage 15 km/l, fuel ₹105 per litre
          this.fuelEstimate = Math.round((km / this.vehicle.clientLocation.mileagePerLitre) * 105);
          console.log('Distance:', this.distance, 'Duration:', this.duration, 'mileage per litre: ', this.vehicle.clientLocation.mileagePerLitre, 'Fuel Estimate:', this.fuelEstimate);

          //
          console.log('Calculating trip amount, convenience fee, and refundable amount');
          console.log('Price per km:', this.vehicle.pricePerKm, 'Distance in km:', this.distanceInKm);
          this.tripAmt = this.vehicle.pricePerKm * this.distanceInKm;
          this.convenienceFee = this.vehicle.convenienceFee;
          this.refundableAmount = this.vehicle.refundableAmt;
          console.log('Trip Amount:', this.tripAmt, 'Convenience Fee:', this.convenienceFee, 'Refundable Amount:', this.refundableAmount);
          this.totalAmt = this.tripAmt + this.convenienceFee + this.refundableAmount;
          // ✅ Set loaded flag after fetching distance
          this.distanceLoaded = true;
        } else {
          this.distance = 'Error fetching distance';
          this.duration = 'N/A';
        }

        // ✅ Set loaded flag after completion
        this.distanceLoaded = true;
      }
    );
  }
}
