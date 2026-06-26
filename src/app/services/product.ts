import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { Product, ApiProduct } from '../models/product.model';

// ── Fallback data (used when API unreachable) ─────────────────────────────
const FALLBACK: Product[] = [
  { id: 1, name: 'Sony WH-1000XM5', price: 279, originalPrice: 349, image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&q=80', category: 'Audio', rating: 4.8, reviews: 2340, badge: 'Best Seller', description: 'Industry-leading noise canceling headphones with 30-hour battery, crystal clear hands-free calling, and multipoint connection for two devices simultaneously.', specs: ['30-hr battery', 'Multipoint BT', 'Foldable design', 'Touch controls'] },
  { id: 2, name: 'Apple iPad Air M2', price: 599, originalPrice: 699, image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80', category: 'Tablets', rating: 4.9, reviews: 1870, badge: 'New', description: 'Supercharged by the M2 chip — the most capable, versatile, and colorful iPad Air ever.', specs: ['M2 chip', '11" Liquid Retina', 'USB-C', 'Apple Pencil Pro'] },
  { id: 3, name: 'Samsung 4K Monitor 32"', price: 449, originalPrice: 549, image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&q=80', category: 'Displays', rating: 4.6, reviews: 983, description: '32-inch 4K UHD monitor with HDR600, 144Hz refresh rate and wide color coverage.', specs: ['4K UHD', '144Hz', 'HDR600', 'USB-C hub'] },
  { id: 4, name: 'Logitech MX Master 3S', price: 89, originalPrice: 109, image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=400&q=80', category: 'Peripherals', rating: 4.7, reviews: 4120, badge: 'Top Rated', description: 'Near-silent clicks, hyper-fast scroll, works on any surface including glass.', specs: ['8000 DPI', 'MagSpeed scroll', 'Multi-device', '70-day battery'] },
  { id: 5, name: 'Keychron Q3 Pro', price: 199, originalPrice: 239, image: 'https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?w=400&q=80', category: 'Peripherals', rating: 4.8, reviews: 761, description: 'Premium wireless mechanical keyboard with QMK/VIA support and hot-swappable switches.', specs: ['Hot-swap', 'QMK/VIA', 'Bluetooth 5.1', 'Aluminum body'] },
  { id: 6, name: 'Anker 65W Charger', price: 39, originalPrice: 55, image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&q=80', category: 'Accessories', rating: 4.5, reviews: 5890, badge: 'Sale', description: 'Compact 65W 3-port USB-C GaN charger. Charge laptop, phone, and tablet simultaneously.', specs: ['65W total', '3 USB-C ports', 'GaN tech', 'Compact'] },
];

function mapApi(api: ApiProduct, i: number): Product {
  const badges: (string | undefined)[] = ['Best Seller', 'New', undefined, 'Top Rated', undefined, 'Sale'];
  return {
    id: api.id,
    name: api.title,
    price: parseFloat(api.price.toFixed(2)),
    originalPrice: Math.round(api.price * 1.25),
    image: api.image,
    category: api.category.charAt(0).toUpperCase() + api.category.slice(1),
    rating: api.rating?.rate ?? 4.5,
    reviews: api.rating?.count ?? 0,
    description: api.description,
    specs: [],
    badge: badges[i % badges.length]
  };
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private readonly API = 'https://fakestoreapi.com';

  // ── In-memory signal cache ──────────────────────────────────────────────
  products  = signal<Product[]>([]);
  loading   = signal(false);
  error     = signal<string | null>(null);
  nextId    = signal(100); // for locally created products

  categories = computed(() => ['All', ...new Set(this.products().map(p => p.category))]);

  // ── Observable methods used by Resolvers ────────────────────────────────

  /** Fetch all products — used by productsResolver */
  fetchProducts(): Observable<Product[]> {
    this.loading.set(true);
    return this.http.get<ApiProduct[]>(`${this.API}/products`).pipe(
      map(list => list.map(mapApi)),
      tap(list => { this.products.set(list); this.loading.set(false); }),
      catchError(() => {
        this.products.set(FALLBACK);
        this.loading.set(false);
        return of(FALLBACK);
      })
    );
  }

  /** Fetch single product by id — used by productDetailResolver */
  fetchById(id: number): Observable<Product> {
    // Check in-memory cache first to avoid extra round-trips
    const cached = this.products().find(p => p.id === id);
    if (cached) return of(cached);

    this.loading.set(true);
    return this.http.get<ApiProduct>(`${this.API}/products/${id}`).pipe(
      map((api, i) => mapApi(api, i)),
      tap(p => {
        this.products.update(list =>
          list.some(x => x.id === p.id) ? list.map(x => x.id === p.id ? p : x) : [...list, p]
        );
        this.loading.set(false);
      }),
      catchError(() => {
        const fb = FALLBACK.find(p => p.id === id) ?? FALLBACK[0];
        this.loading.set(false);
        return of(fb);
      })
    );
  }

  // ── Local CRUD (no real backend — operates on the signal) ────────────────

  addProduct(p: Omit<Product, 'id'>): Product {
    const newProduct: Product = { ...p, id: this.nextId() };
    this.nextId.update(n => n + 1);
    this.products.update(list => [newProduct, ...list]);
    return newProduct;
  }

  updateProduct(updated: Product): void {
    this.products.update(list =>
      list.map(p => p.id === updated.id ? updated : p)
    );
  }

  deleteProduct(id: number): void {
    this.products.update(list => list.filter(p => p.id !== id));
  }

  getById(id: number): Product | undefined {
    return this.products().find(p => p.id === id);
  }
}
