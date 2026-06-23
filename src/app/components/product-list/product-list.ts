import { Component, output } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { CartService, Product } from '../../services/cart';

@Component({
  selector: 'app-product-list',
  imports: [DecimalPipe],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css'
})
export class ProductListComponent {
  openProduct = output<Product>();

  constructor(public cartService: CartService) {}

  addToCart(e: Event, product: Product) {
    e.stopPropagation();
    this.cartService.addToCart(product);
  }

  discount(p: Product) {
    return Math.round((1 - p.price / p.originalPrice) * 100);
  }

  stars(rating: number) {
    return Array.from({ length: 5 }, (_, i) => i < Math.floor(rating) ? 'full' : i < rating ? 'half' : 'empty');
  }
}
