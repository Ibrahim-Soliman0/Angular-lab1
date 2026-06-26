import { Routes } from '@angular/router';
import { productsResolver } from './resolvers/products.resolver';
import { productDetailResolver } from './resolvers/product-detail.resolver';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full'
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./pages/product-list-page/product-list-page')
        .then(m => m.ProductListPageComponent),
    resolve: { products: productsResolver },
    title: 'Products — Circuit Store'
  },
  {
    path: 'products/new',
    loadComponent: () =>
      import('./pages/product-add-edit-page/product-add-edit-page')
        .then(m => m.ProductAddEditPageComponent),
    title: 'Add Product — Circuit Store'
  },
  {
    path: 'products/:id',
    loadComponent: () =>
      import('./pages/product-detail-page/product-detail-page')
        .then(m => m.ProductDetailPageComponent),
    resolve: { product: productDetailResolver },
    title: 'Product — Circuit Store'
  },
  {
    path: 'products/:id/edit',
    loadComponent: () =>
      import('./pages/product-add-edit-page/product-add-edit-page')
        .then(m => m.ProductAddEditPageComponent),
    resolve: { product: productDetailResolver },
    title: 'Edit Product — Circuit Store'
  },
  {
    path: 'cart',
    loadComponent: () =>
      import('./pages/cart-page/cart-page')
        .then(m => m.CartPageComponent),
    title: 'Cart — Circuit Store'
  },
  { path: '**', redirectTo: 'products' }
];
