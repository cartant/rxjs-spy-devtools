import { TestBed, inject } from '@angular/core/testing';
import { ChromeMockService, ChromeService } from '@app/root/chrome';
import { SpyService } from './spy.service';

describe('SpyService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ChromeService, useClass: ChromeMockService },
        SpyService
      ]
    });
  });

  it('should be created', inject([SpyService], (service: SpyService) => {
    expect(service).toBeTruthy();
  }));
});
