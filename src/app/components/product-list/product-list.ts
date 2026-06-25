import { Component, output, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ProductService } from '../../services/product';
import { ProductCartService } from '../../services/product-cart';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-list',
  imports: [DecimalPipe],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css'
})
export class ProductListComponent {
  // Signal-based output (Angular 17+)
  openProduct = output<Product>();

  productService = inject(ProductService);
  cartService    = inject(ProductCartService);

  addToCart(e: Event, product: Product): void {
    e.stopPropagation();
    this.cartService.addToCart(product);
  }

  discount(p: Product): number {
    return Math.round((1 - p.price / p.originalPrice) * 100);
  }

  stars(rating: number): string[] {
    return Array.from({ length: 5 }, (_, i) =>
      i < Math.floor(rating) ? 'full' : i < rating ? 'half' : 'empty'
    );
  }

  // Expose a typed array for skeleton loading
  skeletons = [1, 2, 3, 4, 5, 6];
}
