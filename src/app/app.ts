import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet, NavigationStart, NavigationEnd, NavigationCancel, NavigationError, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner';
import { ProductCartService } from './services/product-cart';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, LoadingSpinnerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  cartService    = inject(ProductCartService);
  private router = inject(Router);

  /** True while a resolver is fetching — shows the loading overlay */
  navigating = signal(false);

  constructor() {
    // Track router events so we can show the spinner during resolver execution
    this.router.events.pipe(
      filter(e =>
        e instanceof NavigationStart ||
        e instanceof NavigationEnd ||
        e instanceof NavigationCancel ||
        e instanceof NavigationError
      )
    ).subscribe(e => {
      this.navigating.set(e instanceof NavigationStart);
    });
  }
}
