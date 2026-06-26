import { Directive, ElementRef, HostListener, input, inject, OnDestroy } from '@angular/core';

/**
 * Custom Attribute Directive — appTooltip
 * Renders a floating tooltip on hover; no third-party library needed.
 * Demonstrates: DOM creation, positioning, signal inputs, OnDestroy cleanup.
 *
 * Usage:
 *   <button appTooltip tooltipText="Remove item">…</button>
 *   <button appTooltip [tooltipText]="'Edit'" [placement]="'bottom'">…</button>
 */
@Directive({
  selector: '[appTooltip]',
  standalone: true
})
export class TooltipDirective implements OnDestroy {
  // Signal-based inputs
  tooltipText = input<string>('');
  placement   = input<'top' | 'bottom'>('top');

  private el  = inject(ElementRef<HTMLElement>);
  private tip: HTMLDivElement | null = null;

  @HostListener('mouseenter')
  show(): void {
    if (!this.tooltipText()) return;

    // Create tooltip element via direct DOM manipulation
    this.tip = document.createElement('div');
    this.tip.className = 'app-tooltip';
    this.tip.textContent = this.tooltipText();

    Object.assign(this.tip.style, {
      position:       'fixed',
      background:     '#0f0f0f',
      color:          '#fff',
      padding:        '5px 10px',
      borderRadius:   '6px',
      fontSize:       '12px',
      fontWeight:     '500',
      whiteSpace:     'nowrap',
      zIndex:         '9999',
      pointerEvents:  'none',
      opacity:        '0',
      transition:     'opacity .15s',
      fontFamily:     'Inter, sans-serif'
    });

    document.body.appendChild(this.tip);

    // Position after paint so getBoundingClientRect is accurate
    requestAnimationFrame(() => {
      if (!this.tip) return;
      const hostRect = this.el.nativeElement.getBoundingClientRect();
      const tipRect  = this.tip.getBoundingClientRect();
      const top = this.placement() === 'top'
        ? hostRect.top  - tipRect.height - 8
        : hostRect.bottom + 8;
      const left = hostRect.left + hostRect.width / 2 - tipRect.width / 2;

      this.tip.style.top  = `${Math.max(4, top)}px`;
      this.tip.style.left = `${Math.max(4, left)}px`;
      this.tip.style.opacity = '1';
    });
  }

  @HostListener('mouseleave')
  hide(): void {
    this.tip?.remove();
    this.tip = null;
  }

  // Cleanup on destroy to avoid dangling DOM nodes
  ngOnDestroy(): void {
    this.tip?.remove();
  }
}
