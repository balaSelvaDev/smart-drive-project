import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appOnlyNumbers]'
})
export class OnlyNumbersDirective {

  @HostListener('keypress', ['$event'])
  onKeyPress(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;

    // Allow: backspace, tab, delete, arrows
    if (charCode === 8 || charCode === 9 || charCode === 37 || charCode === 39 || charCode === 46) {
      return;
    }

    // Allow only 0-9
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    const pastedInput: string = event.clipboardData?.getData('text/plain') ?? '';
    if (!/^\d+$/.test(pastedInput)) {
      event.preventDefault();
    }
  }

}
