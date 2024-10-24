import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgxCountAnimationDirective } from 'ngx-count-animation';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NgxCountAnimationDirective
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {

  public examples: ExampleI[] = [
    {
      title: 'Simple count animation',
      value: 1_000_000
    },
    {
      title: 'Slow duration',
      duration: 5_000,
      value: 1_000_000
    },
    {
      title: 'Fast duration',
      duration: 200,
      value: 1_000_000
    },
    {
      title: 'Minimum-Fraction-Digits 2',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      value: 1_000_000,
    },
    {
      title: 'enableLayoutChangeDetection',
      subtitle: `When "enableLayoutChangeDetection" is "true", there is an ongoing interval listener that continuously monitors layout changes. 
      For instance, when transitioning from a skeleton screen to the normal screen and adjusting element positions, 
      this ensures that your animations will reliably trigger.
      `,
      enableLayoutChangeDetection: true,
      value: 1_000_000
    },
  ];

  public toggleValue(example: ExampleI) {
    example.value = Math.round(Math.random() * 9_999_999);
  }
}

interface ExampleI {
  title: string;
  subtitle?: string;
  value: number;
  duration?: number;
  maximumFractionDigits?: number;
  minimumFractionDigits?: number;
  enableLayoutChangeDetection?: boolean;
}