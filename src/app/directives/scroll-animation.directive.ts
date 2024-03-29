import { Directive, ElementRef, OnInit } from '@angular/core';

@Directive({
  selector: '[appScrollAnimation]'
})
export class ScrollAnimationDirective implements OnInit {

  constructor(private elementRef: ElementRef) { }

  ngOnInit() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.elementRef.nativeElement.classList.add('visible');
        } else {
          this.elementRef.nativeElement.classList.remove('visible');
        }
      });
    });

    observer.observe(this.elementRef.nativeElement);
  }
}
