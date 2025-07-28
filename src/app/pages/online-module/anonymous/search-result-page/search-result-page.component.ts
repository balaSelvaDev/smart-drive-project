import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { VehicleService } from '../../../../core/services/admin-service/vehicle-module/vehicle.service';

declare var bootstrap: any;

interface Vehicle {
  name: string;
  year: number;
  type: string;
  fuel: string;
  seats: number;
  pricePerHour: number;
  distance: string;
  rating: number;
  reviews: number;
  images: string[];
}

@Component({
  selector: 'app-search-result-page',
  templateUrl: './search-result-page.component.html',
  styleUrl: './search-result-page.component.css'
})
export class SearchResultPageComponent {

  hoveredIndex: number | null = null;

  vehicles: Vehicle[] = [
    {
      name: 'KIA Carens',
      year: 2024,
      type: 'Manual',
      fuel: 'Petrol',
      seats: 6,
      pricePerHour: 163,
      distance: '0.0 km away',
      rating: 5.00,
      reviews: 2,
      images: [
        'https://images.unsplash.com/photo-1575936123452-b67c3203c357?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfCBQAq4fDkjizcfZGBW_6ir3gL4Kd8b_3fA&s',
        'https://cdn.prod.website-files.com/62d84e447b4f9e7263d31e94/6399a4d27711a5ad2c9bf5cd_ben-sweet-2LowviVHZ-E-unsplash-1.jpeg'
      ]
    },
    {
      name: 'Renault Kwid',
      year: 2018,
      type: 'Manual',
      fuel: 'Petrol',
      seats: 5,
      pricePerHour: 50,
      distance: '21.1 km away',
      rating: 5.00,
      reviews: 3,
      images: [
        'https://images.unsplash.com/photo-1575936123452-b67c3203c357?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfCBQAq4fDkjizcfZGBW_6ir3gL4Kd8b_3fA&s',
        'https://cdn.prod.website-files.com/62d84e447b4f9e7263d31e94/6399a4d27711a5ad2c9bf5cd_ben-sweet-2LowviVHZ-E-unsplash-1.jpeg'
      ]
    },
    {
      name: 'Renault Kwid',
      year: 2018,
      type: 'Manual',
      fuel: 'Petrol',
      seats: 5,
      pricePerHour: 50,
      distance: '21.1 km away',
      rating: 5.00,
      reviews: 3,
      images: [
        'https://images.unsplash.com/photo-1575936123452-b67c3203c357?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfCBQAq4fDkjizcfZGBW_6ir3gL4Kd8b_3fA&s',
        'https://cdn.prod.website-files.com/62d84e447b4f9e7263d31e94/6399a4d27711a5ad2c9bf5cd_ben-sweet-2LowviVHZ-E-unsplash-1.jpeg'
      ]
    },
    {
      name: 'KIA Carens',
      year: 2024,
      type: 'Manual',
      fuel: 'Petrol',
      seats: 6,
      pricePerHour: 163,
      distance: '0.0 km away',
      rating: 5.00,
      reviews: 2,
      images: [
        'https://images.unsplash.com/photo-1575936123452-b67c3203c357?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfCBQAq4fDkjizcfZGBW_6ir3gL4Kd8b_3fA&s',
        'https://cdn.prod.website-files.com/62d84e447b4f9e7263d31e94/6399a4d27711a5ad2c9bf5cd_ben-sweet-2LowviVHZ-E-unsplash-1.jpeg'
      ]
    },
    {
      name: 'Renault Kwid',
      year: 2018,
      type: 'Manual',
      fuel: 'Petrol',
      seats: 5,
      pricePerHour: 50,
      distance: '21.1 km away',
      rating: 5.00,
      reviews: 3,
      images: [
        'https://images.unsplash.com/photo-1575936123452-b67c3203c357?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfCBQAq4fDkjizcfZGBW_6ir3gL4Kd8b_3fA&s',
        'https://cdn.prod.website-files.com/62d84e447b4f9e7263d31e94/6399a4d27711a5ad2c9bf5cd_ben-sweet-2LowviVHZ-E-unsplash-1.jpeg'
      ]
    },
    {
      name: 'Renault Kwid',
      year: 2018,
      type: 'Manual',
      fuel: 'Petrol',
      seats: 5,
      pricePerHour: 50,
      distance: '21.1 km away',
      rating: 5.00,
      reviews: 3,
      images: [
        'https://images.unsplash.com/photo-1575936123452-b67c3203c357?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfCBQAq4fDkjizcfZGBW_6ir3gL4Kd8b_3fA&s',
        'https://cdn.prod.website-files.com/62d84e447b4f9e7263d31e94/6399a4d27711a5ad2c9bf5cd_ben-sweet-2LowviVHZ-E-unsplash-1.jpeg'
      ]
    },
    {
      name: 'KIA Carens',
      year: 2024,
      type: 'Manual',
      fuel: 'Petrol',
      seats: 6,
      pricePerHour: 163,
      distance: '0.0 km away',
      rating: 5.00,
      reviews: 2,
      images: [
        'https://images.unsplash.com/photo-1575936123452-b67c3203c357?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfCBQAq4fDkjizcfZGBW_6ir3gL4Kd8b_3fA&s',
        'https://cdn.prod.website-files.com/62d84e447b4f9e7263d31e94/6399a4d27711a5ad2c9bf5cd_ben-sweet-2LowviVHZ-E-unsplash-1.jpeg'
      ]
    },
    {
      name: 'Renault Kwid',
      year: 2018,
      type: 'Manual',
      fuel: 'Petrol',
      seats: 5,
      pricePerHour: 50,
      distance: '21.1 km away',
      rating: 5.00,
      reviews: 3,
      images: [
        'https://images.unsplash.com/photo-1575936123452-b67c3203c357?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfCBQAq4fDkjizcfZGBW_6ir3gL4Kd8b_3fA&s',
        'https://cdn.prod.website-files.com/62d84e447b4f9e7263d31e94/6399a4d27711a5ad2c9bf5cd_ben-sweet-2LowviVHZ-E-unsplash-1.jpeg'
      ]
    },
    {
      name: 'Renault Kwid',
      year: 2018,
      type: 'Manual',
      fuel: 'Petrol',
      seats: 5,
      pricePerHour: 50,
      distance: '21.1 km away',
      rating: 5.00,
      reviews: 3,
      images: [
        'https://images.unsplash.com/photo-1575936123452-b67c3203c357?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfCBQAq4fDkjizcfZGBW_6ir3gL4Kd8b_3fA&s',
        'https://cdn.prod.website-files.com/62d84e447b4f9e7263d31e94/6399a4d27711a5ad2c9bf5cd_ben-sweet-2LowviVHZ-E-unsplash-1.jpeg'
      ]
    }
  ];

  vehicleResult: any[] = [];
  totalItems = 0;
  pageSize = 12;
  currentPage = 0;

  constructor(private vehicleService: VehicleService, private router: Router) { }

  ngOnInit(): void {
    this.fetchVehicles(this.currentPage, this.pageSize);
  }

  ngAfterViewInit(): void {
    // Disable auto sliding for all carousels
    const carousels = document.querySelectorAll('.carousel');
    carousels.forEach((carousel: any) => {
      new bootstrap.Carousel(carousel, {
        interval: false,   // stop auto sliding
        ride: false,       // disable riding
        pause: false       // no resume on hover
      });
    });
  }

  fetchVehicles(page: number, size: number): void {
    this.vehicleService.getVehicles(page, size).subscribe(response => {
      console.log(response);
      this.vehicleResult = response.content;
      this.totalItems = response.totalItems;
      this.currentPage = response.currentPage;
      console.log('Fetched vehicles:', this.vehicleResult);
      
    });
    
  }

}
