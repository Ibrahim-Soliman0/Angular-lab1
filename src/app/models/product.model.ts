// ── Shared domain models ────────────────────────────────────────────────────

export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  description: string;
  specs: string[];
  badge?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

// Shape expected from the real REST API (e.g. fakeStoreAPI / your backend)
// Adjust field names if your API differs.
export interface ApiProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: { rate: number; count: number };
}
