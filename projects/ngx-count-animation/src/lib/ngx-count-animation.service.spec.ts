import { TestBed } from '@angular/core/testing';

import { NgxCountService } from './ngx-count-animation.service';

describe('CountUpService', () => {
  let service: NgxCountService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxCountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
