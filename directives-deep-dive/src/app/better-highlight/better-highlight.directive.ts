import { Directive, ElementRef, HostBinding, HostListener, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appBetterHighlight]'
})
export class BetterHighlightDirective implements OnInit {
  @Input()
  defaultColor: string = 'transparent';
  @Input('appBetterHighlight')
  highlightColor: string = 'blue';
  @HostBinding('style.backgroundColor')
  backgroundColor: string = this.defaultColor;

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {
  }

  ngOnInit() {
    this.backgroundColor = this.defaultColor;
    // this.renderer.setStyle(this.elementRef.nativeElement, 'background-color', 'pink');
  }

  @HostListener('mouseenter')
  onMouseOver(eventData: Event) {
    // this.renderer.setStyle(this.elementRef.nativeElement, 'background-color', 'pink');
    this.backgroundColor = this.highlightColor;
  }

  @HostListener('mouseleave')
  onMouseLeave(eventData: Event) {
    // this.renderer.setStyle(this.elementRef.nativeElement, 'background-color', 'transparent');
    this.backgroundColor = this.defaultColor;
  }
}
