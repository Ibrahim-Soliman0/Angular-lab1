import { inject } from '@angular/core';
import { ResolveFn, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { ProductService } from '../services/product';

/**
 * Resolver: productDetailResolver
 * Fetches a single product by :id before the detail or edit page activates.
 * Used by both /products/:id and /products/:id/edit routes.
 */
export const productDetailResolver: ResolveFn<Product> = (
  route: ActivatedRouteSnapshot
): Observable<Product> => {
  const id = Number(route.paramMap.get('id'));
  return inject(ProductService).fetchById(id);
};
