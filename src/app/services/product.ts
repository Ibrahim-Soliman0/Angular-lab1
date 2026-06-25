import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of } from 'rxjs';
import { Product, ApiProduct } from '../models/product.model';

// ── Fallback data used when the API is unreachable ──────────────────────────
const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Sony WH-1000XM5',
    price: 279,
    originalPrice: 349,
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&q=80',
    category: 'Audio',
    rating: 4.8,
    reviews: 2340,
    badge: 'Best Seller',
    description: 'Industry-leading noise canceling headphones with 30-hour battery, crystal clear hands-free calling, and multipoint connection for two devices simultaneously.',
    specs: ['30-hr battery', 'Multipoint BT', 'Foldable design', 'Touch controls']
  },
  {
    id: 2,
    name: 'Apple iPad Air M2',
    price: 599,
    originalPrice: 699,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80',
    category: 'Tablets',
    rating: 4.9,
    reviews: 1870,
    badge: 'New',
    description: 'Supercharged by the M2 chip, iPad Air is the most capable, versatile, and colorful iPad Air ever. The all-screen design is perfect for working, learning, and creating.',
    specs: ['M2 chip', '11" Liquid Retina', 'USB-C', 'Apple Pencil Pro']
  },
  {
    id: 3,
    name: 'Samsung 4K Monitor 32"',
    price: 449,
    originalPrice: 549,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&q=80',
    category: 'Displays',
    rating: 4.6,
    reviews: 983,
    description: 'A stunning 32-inch 4K UHD monitor with HDR600, 144Hz refresh rate and wide color coverage. Perfect for creative professionals and gamers alike.',
    specs: ['4K UHD', '144Hz', 'HDR600', 'USB-C hub']
  },
  {
    id: 4,
    name: 'Logitech MX Master 3S',
    price: 89,
    originalPrice: 109,
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=400&q=80',
    category: 'Peripherals',
    rating: 4.7,
    reviews: 4120,
    badge: 'Top Rated',
    description: 'The most advanced Master Series mouse yet — near-silent clicks, a scroll wheel that shifts into hyper-fast mode, and works on any surface, even glass.',
    specs: ['8000 DPI', 'MagSpeed scroll', 'Multi-device', '70-day battery']
  },
  {
    id: 5,
    name: 'Keychron Q3 Pro',
    price: 199,
    originalPrice: 239,
    image: 'https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?w=400&q=80',
    category: 'Peripherals',
    rating: 4.8,
    reviews: 761,
    description: 'A premium wireless mechanical keyboard with QMK/VIA support, aluminum body, and hot-swappable switches — the perfect blend of customizability and build quality.',
    specs: ['Hot-swap', 'QMK/VIA', 'Bluetooth 5.1', 'Aluminum body']
  },
  {
    id: 6,
    name: 'Anker 65W Charger',
    price: 39,
    originalPrice: 55,
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&q=80',
    category: 'Accessories',
    rating: 4.5,
    reviews: 5890,
    badge: 'Sale',
    description: 'Compact 65W 3-port USB-C charger with GaN technology. Charge your laptop, phone, and tablet simultaneously from a single wall outlet.',
    specs: ['65W total', '3 USB-C ports', 'GaN tech', 'Compact']
  }
];

// ── Mapper: ApiProduct → Product ─────────────────────────────────────────────
// Adjust mapping logic to match your real API response shape.
function mapApiProduct(api: ApiProduct, index: number): Product {
  const originalPrice = Math.round(api.price * 1.25);           // derive original price
  const badges = ['Best Seller', 'New', undefined, 'Top Rated', undefined, 'Sale'];
  return {
    id: api.id,
    name: api.title,
    price: parseFloat(api.price.toFixed(2)),
    originalPrice,
    image: api.image,
    category: api.category.charAt(0).toUpperCase() + api.category.slice(1),
    rating: api.rating?.rate ?? 4.5,
    reviews: api.rating?.count ?? 0,
    description: api.description,
    specs: [],
    badge: badges[index % badges.length]
  };
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);

  // ── Public signals ──────────────────────────────────────────────────────
  products = signal<Product[]>([]);
  loading  = signal<boolean>(false);
  error    = signal<string | null>(null);

  // Derived signals
  categories = computed(() =>
    ['All', ...new Set(this.products().map(p => p.category))]
  );

  // ── Real API endpoint ────────────────────────────────────────────────────
  // Using FakeStoreAPI as a public demo. Replace with your backend URL.
  private readonly API = 'https://fakestoreapi.com';

  constructor() {
    this.loadProducts();
  }

  // ── Load all products ────────────────────────────────────────────────────
  loadProducts(): void {
    this.loading.set(true);
    this.error.set(null);

    this.http
      .get<ApiProduct[]>(`${this.API}/products`)
      .pipe(
        map(apiList => apiList.map((p, i) => mapApiProduct(p, i))),
        catchError(() => {
          // API unreachable → fall back to local data silently
          return of(FALLBACK_PRODUCTS);
        })
      )
      .subscribe(products => {
        this.products.set(products);
        this.loading.set(false);
      });
  }

  // ── Load a single product by ID ──────────────────────────────────────────
  loadProductById(id: number): void {
    this.loading.set(true);
    this.http
      .get<ApiProduct>(`${this.API}/products/${id}`)
      .pipe(
        map(api => mapApiProduct(api, id)),
        catchError(() => {
          const fallback = FALLBACK_PRODUCTS.find(p => p.id === id) ?? FALLBACK_PRODUCTS[0];
          return of(fallback);
        })
      )
      .subscribe(product => {
        // Merge into the signal — update existing or append
        this.products.update(list => {
          const exists = list.some(p => p.id === product.id);
          return exists
            ? list.map(p => p.id === product.id ? product : p)
            : [...list, product];
        });
        this.loading.set(false);
      });
  }

  // ── Get a product by id from the in-memory signal ────────────────────────
  getById(id: number): Product | undefined {
    return this.products().find(p => p.id === id);
  }
}
