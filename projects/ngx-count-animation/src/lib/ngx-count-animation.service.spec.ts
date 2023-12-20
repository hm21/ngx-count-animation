import { TestBed } from '@angular/core/testing';
import { NgxCountService } from './ngx-count-animation.service';

describe('NgxCountService', () => {
  let service: NgxCountService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NgxCountService],
    });
    service = TestBed.inject(NgxCountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have a scroll$ observable', () => {
    expect(service.scroll$).toBeTruthy();
  });
});
