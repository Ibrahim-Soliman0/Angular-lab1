import { Component, inject, signal, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DecimalPipe, NgClass, NgStyle } from '@angular/common';
import { ProductService }     from '../../services/product';
import { ProductCartService } from '../../services/product-cart';
import { Product }            from '../../models/product.model';
import { DiscountPipe }       from '../../shared/pipes/discount-pipe';
import { StockStatusPipe }    from '../../shared/pipes/stock-status-pipe';
import { HighlightDirective } from '../../shared/directives/highlight';
import { TooltipDirective }   from '../../shared/directives/tooltip';
import { IfRoleDirective }    from '../../shared/directives/if-role';
import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal';

@Component({
  selector: 'app-product-list-page',
  standalone: true,
  imports: [
    RouterLink, DecimalPipe, NgClass, NgStyle,
    DiscountPipe, StockStatusPipe,
    HighlightDirective, TooltipDirective, IfRoleDirective,
    ConfirmModalComponent
  ],
  templateUrl: './product-list-page.html',
  styleUrl:    './product-list-page.css'
})
export class ProductListPageComponent {
  private router = inject(Router);
  productService = inject(ProductService);
  cartService    = inject(ProductCartService);

  activeCategory = signal('All');
  searchQuery    = signal('');

  // Delete modal state
  deleteTarget = signal<Product | null>(null);

  filtered = computed(() => {
    const cat = this.activeCategory();
    const q   = this.searchQuery().toLowerCase().trim();
    return this.productService.products().filter(p => {
      const matchCat = cat === 'All' || p.category === cat;
      const matchQ   = !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  });

  stock(p: Product): number { return (p.reviews % 30) + 1; }

  stars(r: number): string[] {
    return Array.from({ length: 5 }, (_, i) =>
      i < Math.floor(r) ? 'full' : i < r ? 'half' : 'empty'
    );
  }

  addToCart(e: Event, p: Product): void {
    e.stopPropagation();
    this.cartService.addToCart(p);
  }

  // Open the confirmation modal instead of using window.confirm
  openDeleteModal(e: Event, product: Product): void {
    e.stopPropagation();
    e.preventDefault();
    this.deleteTarget.set(product);
  }

  confirmDelete(): void {
    const p = this.deleteTarget();
    if (p) this.productService.deleteProduct(p.id);
    this.deleteTarget.set(null);
  }

  cancelDelete(): void {
    this.deleteTarget.set(null);
  }

  setRole(role: string): void {
    sessionStorage.setItem('userRole', role);
    this.router.navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate(['/products']));
  }

  get currentRole(): string {
    return sessionStorage.getItem('userRole') ?? 'guest';
  }
}
