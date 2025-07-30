import { TestBed } from '@angular/core/testing';

import { MainPageToSearchResultService } from './main-page-to-search-result.service';

describe('MainPageToSearchResultService', () => {
  let service: MainPageToSearchResultService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MainPageToSearchResultService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
