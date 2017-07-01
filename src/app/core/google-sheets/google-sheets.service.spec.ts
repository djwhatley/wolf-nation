import { TestBed, inject } from '@angular/core/testing';

import { GoogleSheetsService } from './google-sheets.service';

describe('GoogleSheetsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GoogleSheetsService]
    });
  });

  it('should ...', inject([GoogleSheetsService], (service: GoogleSheetsService) => {
    expect(service).toBeTruthy();
  }));
});
