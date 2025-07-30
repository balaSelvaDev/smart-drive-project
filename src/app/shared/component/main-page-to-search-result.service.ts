import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MainPageToSearchResultService {

  constructor() { }

  private storageKey = 'main-page-obj';

  // Set data and store it in localStorage
  setData(data: any): void {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  // Get data from localStorage
  getData(): any {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : null;
  }

  // Optional: clear data
  clearData(): void {
    localStorage.removeItem(this.storageKey);
  }
}
