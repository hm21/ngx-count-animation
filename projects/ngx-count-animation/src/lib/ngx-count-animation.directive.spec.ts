import { ElementRef, Renderer2 } from '@angular/core';
import { TestBed } from "@angular/core/testing";
import { NgxCountAnimationDirective } from "./ngx-count-animation.directive";

const mockElementRef = {
  nativeElement: document.createElement('div')
};
const mockRenderer = {
  setStyle: () => { }
};

describe('NgxCountAnimationDirective', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [],
      providers: [
        { provide: ElementRef, useValue: mockElementRef },
        { provide: Renderer2, useValue: mockRenderer },
      ]
    }).compileComponents();
  });


  it('should create an instance', () => {
    TestBed.runInInjectionContext(() => {
      const directive = new NgxCountAnimationDirective(true);
      expect(directive).toBeTruthy();
    });
  });
});
