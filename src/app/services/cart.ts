import { Injectable, signal, computed } from '@angular/core';

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

@Injectable({ providedIn: 'root' })
export class CartService {
  products: Product[] = [
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
      description: 'Supercharged by the M2 chip, iPad Air is the most capable, versatile, and colorful iPad Air ever. With the all-screen design, it\'s perfect for working, learning, and creating.',
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
      description: 'A stunning 32-inch 4K UHD monitor with HDR600, 144Hz refresh rate, and wide color coverage. Perfect for creative professionals and gamers alike.',
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
      description: 'The most advanced Master Series mouse yet — with near-silent clicks, a scroll wheel that shifts into hyper-fast mode, and works on any surface, even glass.',
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
      description: 'A premium wireless mechanical keyboard with QMK/VIA support, aluminum body, and hot-swappable switches. The perfect blend of customizability and premium build.',
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

  cartItems = signal<CartItem[]>([]);

  itemCount = computed(() => this.cartItems().reduce((sum, i) => sum + i.quantity, 0));

  subtotal = computed(() =>
    this.cartItems().reduce((sum, i) => sum + i.product.price * i.quantity, 0)
  );

  originalSubtotal = computed(() =>
    this.cartItems().reduce((sum, i) => sum + i.product.originalPrice * i.quantity, 0)
  );

  discount = computed(() => this.originalSubtotal() - this.subtotal());

  addToCart(product: Product) {
    const items = this.cartItems();
    const existing = items.find(i => i.product.id === product.id);
    if (existing) {
      this.cartItems.set(items.map(i =>
        i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
      ));
    } else {
      this.cartItems.set([...items, { product, quantity: 1 }]);
    }
  }

  removeFromCart(productId: number) {
    this.cartItems.set(this.cartItems().filter(i => i.product.id !== productId));
  }

  updateQuantity(productId: number, quantity: number) {
    if (quantity < 1) { this.removeFromCart(productId); return; }
    this.cartItems.set(this.cartItems().map(i =>
      i.product.id === productId ? { ...i, quantity } : i
    ));
  }

  isInCart(productId: number) {
    return this.cartItems().some(i => i.product.id === productId);
  }

  getQuantity(productId: number) {
    return this.cartItems().find(i => i.product.id === productId)?.quantity ?? 0;
  }
}
