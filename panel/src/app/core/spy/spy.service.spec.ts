import { TestBed, inject } from '@angular/core/testing';
import { SpyService } from './spy.service';

describe('SpyService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SpyService]
    });
  });

  it('should be created', inject([SpyService], (service: SpyService) => {
    expect(service).toBeTruthy();
  }));
});
