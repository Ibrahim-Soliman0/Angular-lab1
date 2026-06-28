import { Component, inject, computed, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DecimalPipe, NgClass, NgStyle } from '@angular/common';
import { ProductCartService } from '../../services/product-cart';
import { ProductService }     from '../../services/product';
import { Product }            from '../../models/product.model';
import { DiscountPipe }       from '../../shared/pipes/discount-pipe';
import { StockStatusPipe }    from '../../shared/pipes/stock-status-pipe';
import { HighlightDirective } from '../../shared/directives/highlight';
import { TooltipDirective }   from '../../shared/directives/tooltip';
import { IfRoleDirective }    from '../../shared/directives/if-role';
import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal';

@Component({
  selector: 'app-product-detail-page',
  standalone: true,
  imports: [
    RouterLink, DecimalPipe, NgClass, NgStyle,
    DiscountPipe, StockStatusPipe,
    HighlightDirective, TooltipDirective, IfRoleDirective,
    ConfirmModalComponent
  ],
  templateUrl: './product-detail-page.html',
  styleUrl:    './product-detail-page.css'
})
export class ProductDetailPageComponent {
  private route        = inject(ActivatedRoute);
  private router       = inject(Router);
  cartService          = inject(ProductCartService);
  productService       = inject(ProductService);

  product = computed<Product>(() => this.route.snapshot.data['product']);

  // Delete modal state
  showDeleteModal = signal(false);

  stock(): number { return (this.product().reviews % 30) + 1; }

  stars(r: number): string[] {
    return Array.from({ length: 5 }, (_, i) =>
      i < Math.floor(r) ? 'full' : i < r ? 'half' : 'empty'
    );
  }

  addToCart(): void { this.cartService.addToCart(this.product()); }

  openDeleteModal(): void  { this.showDeleteModal.set(true); }
  cancelDelete(): void     { this.showDeleteModal.set(false); }

  confirmDelete(): void {
    this.productService.deleteProduct(this.product().id);
    this.showDeleteModal.set(false);
    this.router.navigate(['/products']);
  }
}
