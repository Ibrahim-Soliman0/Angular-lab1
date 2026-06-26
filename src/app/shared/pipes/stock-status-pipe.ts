import { Pipe, PipeTransform } from '@angular/core';

/**
 * Custom Pipe — StockStatusPipe
 * Converts a numeric stock count into a human-readable label.
 *
 * Usage: {{ stock | stockStatus }}
 * Example outputs: "Out of Stock" | "Only 3 left!" | "Low Stock" | "In Stock"
 */
@Pipe({ name: 'stockStatus', standalone: true })
export class StockStatusPipe implements PipeTransform {
  transform(value: number): string {
    if (value <= 0)  return 'Out of Stock';
    if (value <= 5)  return `Only ${value} left!`;
    if (value <= 20) return 'Low Stock';
    return 'In Stock';
  }
}
