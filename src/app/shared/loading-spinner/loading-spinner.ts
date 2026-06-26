import { Component, input } from '@angular/core';

/**
 * Global loading spinner shown during resolver navigation.
 * Accepts a `message` input for context-aware labels.
 */
@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  templateUrl: './loading-spinner.html',
  styleUrl: './loading-spinner.css'
})
export class LoadingSpinnerComponent {
  message = input<string>('Loading...');
  overlay = input<boolean>(false);
}
