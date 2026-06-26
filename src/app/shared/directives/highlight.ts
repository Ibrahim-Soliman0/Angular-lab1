import { Directive, ElementRef, HostListener, input, inject } from '@angular/core';

/**
 * Custom Attribute Directive — appHighlight
 * Applies a background-color highlight to an element on hover.
 * Demonstrates: ElementRef, HostListener, signal-based inputs, DOM manipulation.
 *
 * Usage:
 *   <article appHighlight>…</article>
 *   <article appHighlight [highlightColor]="'#eff6ff'" [defaultBg]="'white'">…</article>
 */
@Directive({
  selector: '[appHighlight]',
  standalone: true
})
export class HighlightDirective {
  // Signal-based inputs (Angular 17+)
  highlightColor = input<string>('#f0f7ff');
  defaultBg      = input<string>('transparent');

  private el = inject(ElementRef<HTMLElement>);

  @HostListener('mouseenter')
  onEnter(): void {
    const el = this.el.nativeElement;
    // Direct DOM property manipulation
    el.style.backgroundColor = this.highlightColor();
    el.style.transition = 'background-color .2s ease';
  }

  @HostListener('mouseleave')
  onLeave(): void {
    this.el.nativeElement.style.backgroundColor = this.defaultBg();
  }
}
