import { TestBed, inject } from '@angular/core/testing';
import { ChromeService } from './chrome.service';

describe('ChromeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChromeService]
    });
  });

  it('should be created', inject([ChromeService], (service: ChromeService) => {
    expect(service).toBeTruthy();
  }));
});
