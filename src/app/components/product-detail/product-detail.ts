import { Component, input, output } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { CartService, Product } from '../../services/cart';

@Component({
  selector: 'app-product-detail',
  imports: [DecimalPipe],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css'
})
export class ProductDetailComponent {
  product = input.required<Product>();
  back = output<void>();

  constructor(public cartService: CartService) {}

  addToCart() {
    this.cartService.addToCart(this.product());
  }

  discount(p: Product) {
    return Math.round((1 - p.price / p.originalPrice) * 100);
  }

  stars(rating: number) {
    return Array.from({ length: 5 }, (_, i) => i < Math.floor(rating) ? 'full' : i < rating ? 'half' : 'empty');
  }
}
