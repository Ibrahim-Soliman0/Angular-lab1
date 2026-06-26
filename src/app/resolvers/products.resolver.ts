import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { ProductService } from '../services/product';

/**
 * Resolver: productsResolver
 * Fetches the full product list before the ProductListPage activates.
 * The router waits for this Observable to complete, so the loading
 * overlay in AppComponent is visible until data arrives.
 */
export const productsResolver: ResolveFn<Product[]> = (): Observable<Product[]> => {
  return inject(ProductService).fetchProducts();
};
