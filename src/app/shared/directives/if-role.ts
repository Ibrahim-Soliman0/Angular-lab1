import {
  Directive, TemplateRef, ViewContainerRef,
  input, inject, effect
} from '@angular/core';

/**
 * Custom Structural Directive — *appIfRole
 * Conditionally renders its host element only when the current
 * user's role matches the required role.
 *
 * Role is stored in sessionStorage so it persists across the session.
 * Switch roles via the toolbar on the product list page.
 *
 * Usage:
 *   <button *appIfRole="'admin'">Delete</button>
 *   <a *appIfRole="'admin'" routerLink="/products/new">Add</a>
 *
 * Note: This is a UI guard only — real apps enforce permissions server-side.
 */
@Directive({
  selector: '[appIfRole]',
  standalone: true
})
export class IfRoleDirective {
  // Signal-based input (Angular 17+)
  appIfRole = input<string>('');

  private tpl = inject(TemplateRef);
  private vcr = inject(ViewContainerRef);

  constructor() {
    // Re-evaluate whenever the required-role signal changes
    effect(() => {
      const required = this.appIfRole();
      const current  = sessionStorage.getItem('userRole') ?? 'guest';
      this.vcr.clear();
      // Show the element if roles match, or no role restriction is set
      if (!required || current === required) {
        this.vcr.createEmbeddedView(this.tpl);
      }
    });
  }
}
