import { Component, signal } from '@angular/core';
import { ProductListComponent } from './components/product-list/product-list';
import { ProductDetailComponent } from './components/product-detail/product-detail';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart';
import { Product } from './services/cart';
import { CartService } from './services/cart';

@Component({
  selector: 'app-root',
  imports: [ProductListComponent, ProductDetailComponent, ShoppingCartComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  selectedProduct = signal<Product | null>(null);
  cartOpen = signal(false);

  constructor(public cartService: CartService) {}

  openDetail(product: Product) {
    this.selectedProduct.set(product);
    this.cartOpen.set(false);
  }

  closeDetail() {
    this.selectedProduct.set(null);
  }

  toggleCart() {
    this.cartOpen.update(v => !v);
    this.selectedProduct.set(null);
  }
}
