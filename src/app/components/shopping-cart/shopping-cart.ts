import { Component, output } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { CartService, CartItem } from '../../services/cart';

@Component({
  selector: 'app-shopping-cart',
  imports: [DecimalPipe],
  templateUrl: './shopping-cart.html',
  styleUrl: './shopping-cart.css'
})
export class ShoppingCartComponent {
  close = output<void>();

  constructor(public cartService: CartService) {}

  onQuantityChange(item: CartItem, value: string) {
    const n = parseInt(value, 10);
    if (!isNaN(n)) {
      this.cartService.updateQuantity(item.product.id, n);
    }
  }

  increment(item: CartItem) {
    this.cartService.updateQuantity(item.product.id, item.quantity + 1);
  }

  decrement(item: CartItem) {
    this.cartService.updateQuantity(item.product.id, item.quantity - 1);
  }

  remove(item: CartItem) {
    this.cartService.removeFromCart(item.product.id);
  }

  itemTotal(item: CartItem) {
    return item.product.price * item.quantity;
  }

  itemOriginalTotal(item: CartItem) {
    return item.product.originalPrice * item.quantity;
  }

  itemDiscount(item: CartItem) {
    return Math.round((1 - item.product.price / item.product.originalPrice) * 100);
  }
}
