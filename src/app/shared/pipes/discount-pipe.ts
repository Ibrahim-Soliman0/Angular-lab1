import { Pipe, PipeTransform } from '@angular/core';

/**
 * Custom Pipe — DiscountPipe
 * Calculates and formats the discount between two prices.
 *
 * Usage:
 *   {{ product.price | discount:product.originalPrice }}          → "20%"
 *   {{ product.price | discount:product.originalPrice:'label' }}  → "-20% OFF"
 *   {{ product.price | discount:product.originalPrice:'saved' }}  → "Save $70.00"
 */
@Pipe({ name: 'discount', standalone: true })
export class DiscountPipe implements PipeTransform {
  transform(
    price: number,
    originalPrice: number,
    format: 'percent' | 'label' | 'saved' = 'percent'
  ): string {
    if (!originalPrice || originalPrice <= price) return '';
    const pct   = Math.round((1 - price / originalPrice) * 100);
    const saved = (originalPrice - price).toFixed(2);
    switch (format) {
      case 'label':  return `-${pct}% OFF`;
      case 'saved':  return `Save $${saved}`;
      default:       return `${pct}%`;
    }
  }
}
