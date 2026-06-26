import { Component, inject, computed, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgClass, DecimalPipe } from '@angular/common';
import { ProductService } from '../../services/product';
import { Product }        from '../../models/product.model';
import { TooltipDirective } from '../../shared/directives/tooltip';

interface ProductForm {
  name:          string;
  price:         number | null;
  originalPrice: number | null;
  category:      string;
  description:   string;
  image:         string;
  badge:         string;
  specs:         string;
  rating:        number | null;
  reviews:       number | null;
}

@Component({
  selector: 'app-product-add-edit-page',
  standalone: true,
  imports: [RouterLink, FormsModule, NgClass, DecimalPipe, TooltipDirective],
  templateUrl: './product-add-edit-page.html',
  styleUrl: './product-add-edit-page.css'
})
export class ProductAddEditPageComponent implements OnInit {
  private route          = inject(ActivatedRoute);
  private router         = inject(Router);
  private productService = inject(ProductService);

  isEdit      = computed(() => !!this.route.snapshot.data['product']);
  editProduct = computed<Product | null>(() => this.route.snapshot.data['product'] ?? null);

  saved   = signal(false);
  touched = signal(false);

  form: ProductForm = {
    name: '', price: null, originalPrice: null,
    category: '', description: '', image: '',
    badge: '', specs: '', rating: null, reviews: null
  };

  categories = ['Audio', 'Tablets', 'Displays', 'Peripherals', 'Accessories'];
  badges     = ['', 'Best Seller', 'New', 'Top Rated', 'Sale'];

  ngOnInit(): void {
    const p = this.editProduct();
    if (p) {
      this.form = {
        name: p.name, price: p.price, originalPrice: p.originalPrice,
        category: p.category, description: p.description, image: p.image,
        badge: p.badge ?? '', specs: p.specs.join(', '),
        rating: p.rating, reviews: p.reviews
      };
    }
  }

  isValid(): boolean {
    const f = this.form;
    return !!(f.name && f.price && f.originalPrice && f.category && f.description
      && f.price > 0 && f.originalPrice >= f.price);
  }

  submit(): void {
    this.touched.set(true);
    if (!this.isValid()) return;
    const payload: Omit<Product, 'id'> = {
      name:          this.form.name.trim(),
      price:         this.form.price!,
      originalPrice: this.form.originalPrice!,
      category:      this.form.category,
      description:   this.form.description.trim(),
      image:         this.form.image || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80',
      badge:         this.form.badge || undefined,
      specs:         this.form.specs ? this.form.specs.split(',').map(s => s.trim()).filter(Boolean) : [],
      rating:        this.form.rating ?? 4.5,
      reviews:       this.form.reviews ?? 0
    };
    if (this.isEdit()) {
      this.productService.updateProduct({ ...payload, id: this.editProduct()!.id });
    } else {
      this.productService.addProduct(payload);
    }
    this.saved.set(true);
    setTimeout(() => this.router.navigate(['/products']), 1200);
  }

  discard(): void {
    const p = this.editProduct();
    this.router.navigate(p ? [`/products/${p.id}`] : ['/products']);
  }
}
