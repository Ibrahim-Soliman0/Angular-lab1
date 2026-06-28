import { Component, input, output } from '@angular/core';

/**
 * Reusable delete-confirmation modal.
 * Accepts `productName` as a signal input and emits `confirm` or `cancel`.
 *
 * Usage:
 *   <app-confirm-modal
 *     [productName]="name"
 *     (confirm)="onConfirm()"
 *     (cancel)="onCancel()"
 *   />
 */
@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  templateUrl: './confirm-modal.html',
  styleUrl:    './confirm-modal.css'
})
export class ConfirmModalComponent {
  // Signal-based inputs (Angular 17+)
  productName = input<string>('this product');
  danger      = input<boolean>(true);

  // Signal-based outputs
  confirm = output<void>();
  cancel  = output<void>();
}
