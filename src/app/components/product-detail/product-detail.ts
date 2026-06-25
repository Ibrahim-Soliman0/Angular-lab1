import { Component, input, output, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ProductCartService } from '../../services/product-cart';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-detail',
  imports: [DecimalPipe],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css'
})
export class ProductDetailComponent {
  // Signal-based input & output (Angular 17+)
  product = input.required<Product>();
  back    = output<void>();

  cartService = inject(ProductCartService);

  addToCart(): void {
    this.cartService.addToCart(this.product());
  }

  discount(p: Product): number {
    return Math.round((1 - p.price / p.originalPrice) * 100);
  }

  stars(rating: number): string[] {
    return Array.from({ length: 5 }, (_, i) =>
      i < Math.floor(rating) ? 'full' : i < rating ? 'half' : 'empty'
    );
  }
}
