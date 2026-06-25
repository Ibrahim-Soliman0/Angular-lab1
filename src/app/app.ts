import { Component, signal, inject } from '@angular/core';
import { ProductListComponent } from './components/product-list/product-list';
import { ProductDetailComponent } from './components/product-detail/product-detail';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart';
import { Product } from './models/product.model';
import { ProductCartService } from './services/product-cart';

@Component({
  selector: 'app-root',
  imports: [ProductListComponent, ProductDetailComponent, ShoppingCartComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  cartService = inject(ProductCartService);

  // Signal-based navigation state
  selectedProduct = signal<Product | null>(null);
  cartOpen        = signal(false);

  // Expose cart count signal directly from the service
  itemCount = this.cartService.itemCount;

  openDetail(product: Product): void {
    this.selectedProduct.set(product);
    this.cartOpen.set(false);
  }

  closeDetail(): void {
    this.selectedProduct.set(null);
  }

  toggleCart(): void {
    this.cartOpen.update(v => !v);
    this.selectedProduct.set(null);
  }
}
