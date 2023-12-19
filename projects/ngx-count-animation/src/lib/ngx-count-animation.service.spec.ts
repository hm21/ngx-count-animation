import { TestBed } from '@angular/core/testing';

import { NgxCountUpService } from './ngx-count-animation.service';

describe('CountUpService', () => {
  let service: NgxCountUpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxCountUpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
