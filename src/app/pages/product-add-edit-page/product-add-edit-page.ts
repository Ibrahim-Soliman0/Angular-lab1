import {
  Component, inject, computed, signal, OnInit, OnDestroy
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  ReactiveFormsModule, FormBuilder, FormGroup, FormArray,
  Validators, AbstractControl, ValidationErrors
} from '@angular/forms';
import { DecimalPipe, NgClass, JsonPipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { ProductService }   from '../../services/product';
import { Product }          from '../../models/product.model';
import { TooltipDirective } from '../../shared/directives/tooltip';
import { HighlightDirective } from '../../shared/directives/highlight';

// ── Custom cross-field validator ─────────────────────────────────────────────
// Ensures originalPrice >= price
function priceRangeValidator(group: AbstractControl): ValidationErrors | null {
  const price    = group.get('price')?.value;
  const original = group.get('originalPrice')?.value;
  if (price != null && original != null && original < price) {
    return { originalLessThanPrice: true };
  }
  return null;
}

// ── Custom async-style validator: no digits-only names ───────────────────────
function noDigitsOnlyValidator(ctrl: AbstractControl): ValidationErrors | null {
  const v = (ctrl.value ?? '').trim();
  return v && /^\d+$/.test(v) ? { digitsOnly: true } : null;
}

@Component({
  selector: 'app-product-add-edit-page',
  standalone: true,
  imports: [
    RouterLink, ReactiveFormsModule, NgClass, JsonPipe,
    TooltipDirective, HighlightDirective
  ],
  templateUrl: './product-add-edit-page.html',
  styleUrl:    './product-add-edit-page.css'
})
export class ProductAddEditPageComponent implements OnInit, OnDestroy {
  private route          = inject(ActivatedRoute);
  private router         = inject(Router);
  private fb             = inject(FormBuilder);
  private productService = inject(ProductService);

  // ── Route-resolver data ──────────────────────────────────────────────────
  isEdit      = computed(() => !!this.route.snapshot.data['product']);
  editProduct = computed<Product | null>(() => this.route.snapshot.data['product'] ?? null);

  // ── UI state signals ─────────────────────────────────────────────────────
  saved        = signal(false);
  submitTried  = signal(false);

  // ── Reactive form ────────────────────────────────────────────────────────
  form!: FormGroup;

  // Live-preview model (updated via valueChanges subscription)
  preview = signal<Partial<Product>>({});

  private sub!: Subscription;

  categories = ['Audio', 'Tablets', 'Displays', 'Peripherals', 'Accessories'];
  badges     = ['', 'Best Seller', 'New', 'Top Rated', 'Sale'];

  // ── Convenience getters for template ────────────────────────────────────
  get name()          { return this.form.get('name')!; }
  get price()         { return this.form.get('price')!; }
  get originalPrice() { return this.form.get('originalPrice')!; }
  get category()      { return this.form.get('category')!; }
  get description()   { return this.form.get('description')!; }
  get image()         { return this.form.get('image')!; }
  get badge()         { return this.form.get('badge')!; }
  get rating()        { return this.form.get('rating')!; }
  get reviews()       { return this.form.get('reviews')!; }
  get specsArray()    { return this.form.get('specs') as FormArray; }

  // Helper: should a field show its error?
  showError(ctrl: AbstractControl): boolean {
    return (ctrl.invalid && (ctrl.dirty || ctrl.touched)) || (ctrl.invalid && this.submitTried());
  }

  // ── Lifecycle ────────────────────────────────────────────────────────────
  ngOnInit(): void {
    const p = this.editProduct();

    this.form = this.fb.group(
      {
        name: [
          p?.name ?? '',
          [Validators.required, Validators.minLength(3), Validators.maxLength(80), noDigitsOnlyValidator]
        ],
        price: [
          p?.price ?? null,
          [Validators.required, Validators.min(0.01)]
        ],
        originalPrice: [
          p?.originalPrice ?? null,
          [Validators.required, Validators.min(0.01)]
        ],
        category:    [p?.category ?? '',    [Validators.required]],
        description: [p?.description ?? '', [Validators.required, Validators.minLength(10)]],
        image:       [p?.image ?? '',       []],
        badge:       [p?.badge ?? '',       []],
        rating:      [p?.rating ?? 4.5,     [Validators.min(0), Validators.max(5)]],
        reviews:     [p?.reviews ?? 0,      [Validators.min(0)]],
        // FormArray — each spec is its own FormControl
        specs: this.fb.array(
          (p?.specs ?? []).map(s => this.fb.control(s, [Validators.required, Validators.minLength(2)]))
        )
      },
      { validators: priceRangeValidator }   // cross-field validator on the group
    );

    // Keep the live preview in sync via valueChanges
    this.sub = this.form.valueChanges.subscribe(val => {
      this.preview.set({
        name:          val.name,
        price:         val.price,
        originalPrice: val.originalPrice,
        category:      val.category,
        description:   val.description,
        image:         val.image,
        badge:         val.badge || undefined
      });
    });

    // Trigger initial preview
    this.preview.set({
      name:          p?.name,
      price:         p?.price,
      originalPrice: p?.originalPrice,
      category:      p?.category,
      description:   p?.description,
      image:         p?.image,
      badge:         p?.badge
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  // ── Spec FormArray helpers ───────────────────────────────────────────────
  addSpec(): void {
    this.specsArray.push(
      this.fb.control('', [Validators.required, Validators.minLength(2)])
    );
  }

  removeSpec(index: number): void {
    this.specsArray.removeAt(index);
  }

  // ── Submit ───────────────────────────────────────────────────────────────
  submit(): void {
    this.submitTried.set(true);
    this.form.markAllAsTouched();

    if (this.form.invalid) return;

    const val = this.form.getRawValue();
    const payload: Omit<Product, 'id'> = {
      name:          val.name.trim(),
      price:         +val.price,
      originalPrice: +val.originalPrice,
      category:      val.category,
      description:   val.description.trim(),
      image:         val.image?.trim() || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80',
      badge:         val.badge || undefined,
      specs:         (val.specs as string[]).filter(Boolean),
      rating:        +val.rating,
      reviews:       +val.reviews
    };

    if (this.isEdit()) {
      this.productService.updateProduct({ ...payload, id: this.editProduct()!.id });
    } else {
      this.productService.addProduct(payload);
    }

    this.saved.set(true);
    setTimeout(() => this.router.navigate(['/products']), 1400);
  }

  discard(): void {
    const p = this.editProduct();
    this.router.navigate(p ? [`/products/${p.id}`] : ['/products']);
  }

  // ── Preview helpers ──────────────────────────────────────────────────────
  previewDiscount(): number {
    const p = this.preview();
    if (!p.price || !p.originalPrice || p.originalPrice <= p.price) return 0;
    return Math.round((1 - p.price / p.originalPrice) * 100);
  }
}
