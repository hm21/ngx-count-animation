import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from "@angular/core/testing";
import { By } from '@angular/platform-browser';
import { NgxCountAnimationDirective } from "./ngx-count-animation.directive";
import { NgxCountAnimationModule } from './ngx-count-animation.module';
import { provideNgxCountAnimations } from './ngx-count-animation.provider';

@Component({
  selector: 'app-test-host',
  template: `
    <div ngxCountAnimation="100000"></div>
  `,
})
class TestHostComponent { }
describe('NgxCountAnimationDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let directive: NgxCountAnimationDirective;
  let element: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[NgxCountAnimationModule],
      declarations: [TestHostComponent],
      providers:[
        provideNgxCountAnimations(),
      ]
    });

    fixture = TestBed.createComponent(TestHostComponent);
    directive = fixture.debugElement.query(By.directive(NgxCountAnimationDirective)).injector.get(NgxCountAnimationDirective);
    element = fixture.debugElement.query(By.css('div'));
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should have default detectLayoutChanges set to false', () => {
    expect(directive.detectLayoutChanges).toBeFalsy();
  });

  it('should have default maximumFractionDigits set to 0', () => {
    expect(directive.maximumFractionDigits).toEqual(0);
  });

  it('should have default minimumFractionDigits set to 0', () => {
    expect(directive.minimumFractionDigits).toEqual(0);
  });

  it('should start counting when ngxCountAnimation is set', fakeAsync(() => {
    const initDelay = 100;
    const duration = 100;
    const countValue = 100;
    directive.ngxCountAnimation = countValue;
    directive.duration = duration;
    fixture.detectChanges();
    tick(duration + initDelay);
    expect(element.nativeElement.textContent).toContain(countValue.toString());
  }));
});
