import { Component, inject, computed } from '@angular/core';
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

@Component({
  selector: 'app-product-detail-page',
  standalone: true,
  imports: [
    RouterLink, DecimalPipe, NgClass, NgStyle,
    DiscountPipe, StockStatusPipe,
    HighlightDirective, TooltipDirective, IfRoleDirective
  ],
  templateUrl: './product-detail-page.html',
  styleUrl: './product-detail-page.css'
})
export class ProductDetailPageComponent {
  private route        = inject(ActivatedRoute);
  private router       = inject(Router);
  cartService          = inject(ProductCartService);
  productService       = inject(ProductService);

  // Product is injected from the resolver via route data
  product = computed<Product>(() => this.route.snapshot.data['product']);

  stock(): number {
    return (this.product().reviews % 30) + 1;
  }

  stars(r: number): string[] {
    return Array.from({ length: 5 }, (_, i) =>
      i < Math.floor(r) ? 'full' : i < r ? 'half' : 'empty'
    );
  }

  addToCart(): void {
    this.cartService.addToCart(this.product());
  }

  deleteProduct(): void {
    if (confirm('Delete this product permanently?')) {
      this.productService.deleteProduct(this.product().id);
      this.router.navigate(['/products']);
    }
  }
}
