import { Component, output, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ProductCartService } from '../../services/product-cart';
import { CartItem } from '../../models/product.model';

@Component({
  selector: 'app-shopping-cart',
  imports: [DecimalPipe],
  templateUrl: './shopping-cart.html',
  styleUrl: './shopping-cart.css'
})
export class ShoppingCartComponent {
  // Signal-based output
  close = output<void>();

  cartService = inject(ProductCartService);

  increment(item: CartItem): void {
    this.cartService.updateQuantity(item.product.id, item.quantity + 1);
  }

  decrement(item: CartItem): void {
    this.cartService.updateQuantity(item.product.id, item.quantity - 1);
  }

  remove(item: CartItem): void {
    this.cartService.removeFromCart(item.product.id);
  }
}
