import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[countUp]',
  standalone: true   // ✅ very important
})
export class CountUpDirective implements OnInit {
  @Input('countUp') countTo!: number;
  @Input() duration: number = 1000; // duration in ms

  constructor(private el: ElementRef) { }

  ngOnInit() {
    this.animateCount();
  }

  animateCount() {
    let start = 0;
    const end = this.countTo || 0;
    const increment = Math.ceil(end / (this.duration / 16)); // ~60fps

    const interval = setInterval(() => {
      start += increment;
      if (start >= end) {
        start = end;
        clearInterval(interval);
      }
      this.el.nativeElement.innerText = start;
    }, 16);
  }
}
