import {
  Component,
  DebugElement,
  provideExperimentalZonelessChangeDetection,
  signal,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { lastValueFrom, timer } from 'rxjs';
import { NgxCountAnimationDirective } from './ngx-count-animation.directive';
import { provideNgxCountAnimations } from './provider/ngx-count-animation.provider';

@Component({
  selector: 'app-test-host',
  template: `
    <div [ngxCountAnimation]="countValue()" [duration]="duration()"></div>
  `,
})
class TestHostComponent {
  duration = signal(2000);
  countValue = signal(0);
}
describe('NgxCountAnimationDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let directive: NgxCountAnimationDirective;
  let element: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestHostComponent],
      imports: [NgxCountAnimationDirective],
      providers: [
        provideNgxCountAnimations(),
        provideExperimentalZonelessChangeDetection(),
      ],
    });

    fixture = TestBed.createComponent(TestHostComponent);
    directive = fixture.debugElement
      .query(By.directive(NgxCountAnimationDirective))
      .injector.get(NgxCountAnimationDirective);

    element = fixture.debugElement.query(By.css('div'));
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should have default enableLayoutChangeDetection set to false', () => {
    expect(directive.enableLayoutChangeDetection()).toBeFalsy();
  });

  it('should have default maximumFractionDigits set to 0', () => {
    expect(directive.maximumFractionDigits()).toEqual(0);
  });

  it('should have default minimumFractionDigits set to 0', () => {
    expect(directive.minimumFractionDigits()).toEqual(0);
  });

  it('should start counting when ngxCountAnimation is set', async () => {
    const duration = 100;
    const countValue = 100;

    fixture.componentInstance.duration.set(duration);
    fixture.componentInstance.countValue.set(countValue);

    fixture.detectChanges();

    await lastValueFrom(timer(duration + 100));

    expect(element.nativeElement.textContent).toContain(countValue.toString());
  });
});
