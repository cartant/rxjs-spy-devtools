import { TestBed, inject } from '@angular/core/testing';
import { ChromeMockService } from './chrome-mock.service';

describe('ChromeMockService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChromeMockService]
    });
  });

  it('should be created', inject([ChromeMockService], (service: ChromeMockService) => {
    expect(service).toBeTruthy();
  }));
});
