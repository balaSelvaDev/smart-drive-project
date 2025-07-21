import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, map, Observable, switchMap } from 'rxjs';

@Component({
  selector: 'app-booking-get',
  templateUrl: './booking-get.component.html',
  styleUrl: './booking-get.component.css'
})
export class BookingGetComponent {

  constructor(private router: Router, private http: HttpClient) { }

  navigateToAddBooking() {
    this.router.navigate(['/admin/add-booking']); // absolute navigation
  }

  locationControl = new FormControl();
  suggestions$: Observable<string[]>;


  ngOnInit(): void {
    this.suggestions$ = this.locationControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((query) => this.getSuggestions(query))
    );
  }

  getSuggestions(query: string): Observable<string[]> {
    if (!query || query.length < 2) return new Observable<string[]>((observer) => observer.next([]));

    const headers = new HttpHeaders({
      'Authorization': 'eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjAwNjhiNDlhYTI5YjRiNDQ5ZTgyMWQ1YTlmOTZjNTFlIiwiaCI6Im11cm11cjY0In0='  // 🔑 Replace with your ORS key
    });

    const params = new HttpParams()
      .set('text', query)
      .set('size', '5');

    return this.http
      .get<any>(`https://api.openrouteservice.org/geocode/autocomplete?api_key=eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjAwNjhiNDlhYTI5YjRiNDQ5ZTgyMWQ1YTlmOTZjNTFlIiwiaCI6Im11cm11cjY0In0=&text=${query}&size=5`)
      .pipe(
        map((res) =>
          res.features?.map((f: any) => f.properties.label) || []
        )
      );
  }

  onOptionSelected(selected: string): void {
    console.log('Selected:', selected);
    // Optional: Do something with the selected location
  }

}
