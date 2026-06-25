import { Injectable, signal, computed } from '@angular/core';
import { Product, CartItem } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductCartService {

  // ── Cart state ────────────────────────────────────────────────────────────
  cartItems = signal<CartItem[]>([]);

  // ── Computed aggregates ───────────────────────────────────────────────────
  itemCount = computed(() =>
    this.cartItems().reduce((sum, i) => sum + i.quantity, 0)
  );

  /** Total price BEFORE any discount (sum of originalPrice × qty) */
  originalSubtotal = computed(() =>
    this.cartItems().reduce((sum, i) => sum + i.product.originalPrice * i.quantity, 0)
  );

  /** Total price AFTER discount (sum of price × qty) */
  subtotal = computed(() =>
    this.cartItems().reduce((sum, i) => sum + i.product.price * i.quantity, 0)
  );

  /** Total savings */
  totalDiscount = computed(() => this.originalSubtotal() - this.subtotal());

  // ── Per-item helpers (called from the template) ───────────────────────────

  /** price × qty for one row */
  itemTotal(item: CartItem): number {
    return item.product.price * item.quantity;
  }

  /** originalPrice × qty for one row */
  itemOriginalTotal(item: CartItem): number {
    return item.product.originalPrice * item.quantity;
  }

  /** Discount % for display */
  itemDiscountPct(item: CartItem): number {
    return Math.round((1 - item.product.price / item.product.originalPrice) * 100);
  }

  // ── Mutation methods ──────────────────────────────────────────────────────

  addToCart(product: Product): void {
    const existing = this.cartItems().find(i => i.product.id === product.id);
    if (existing) {
      this.updateQuantity(product.id, existing.quantity + 1);
    } else {
      this.cartItems.update(items => [...items, { product, quantity: 1 }]);
    }
  }

  removeFromCart(productId: number): void {
    this.cartItems.update(items => items.filter(i => i.product.id !== productId));
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity < 1) {
      this.removeFromCart(productId);
      return;
    }
    this.cartItems.update(items =>
      items.map(i => i.product.id === productId ? { ...i, quantity } : i)
    );
  }

  clearCart(): void {
    this.cartItems.set([]);
  }

  // ── Query helpers ─────────────────────────────────────────────────────────

  isInCart(productId: number): boolean {
    return this.cartItems().some(i => i.product.id === productId);
  }

  getQuantity(productId: number): number {
    return this.cartItems().find(i => i.product.id === productId)?.quantity ?? 0;
  }
}
