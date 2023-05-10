import { Directive, ElementRef, HostListener, Input } from '@angular/core';
@Directive({
  selector: '[appInputRestriction]',
})
export class InputRestrictionDirective {
  inputElement: ElementRef;

  @Input('appInputRestriction') appInputRestriction: string;
  arabicRegex1 = /^[.a-zA-Z0-9]*$/;
  arabicRegex2 = /^[@a-zA-Z0-9]*$/;
  arabicRegex3 = /^[-a-zA-Z0-9]*$/;
  arabicRegex4 = /^[a-zA-Z0-9_ ]*$/;
  arabicRegex = /^[a-zA-Z0-9]*$/;
  constructor(el: ElementRef) {
    this.inputElement = el;
  }

  @HostListener('keypress', ['$event']) onKeyPress(event) {
    if (this.appInputRestriction === 'integer') {
      this.integerOnly(event);
    } else if (this.appInputRestriction === 'noSpecialChars') {
      this.noSpecialChars(event);
    }
    else if (this.appInputRestriction === 'noSpecialCharFN') {
      this.noSpecialCharFN(event);
    }
    else if (this.appInputRestriction === 'noSpecialChars1') {
      this.noSpecialChars1(event);
    }
    else if (this.appInputRestriction === 'noSpecialChars2') {
      this.noSpecialChars2(event);
    }
    else if (this.appInputRestriction === 'noSpecialChars3') {
      this.noSpecialChars3(event);
    }
  }

  integerOnly(event) {
    const e = <KeyboardEvent>event;
    if (e.key === 'Tab' || e.key === 'TAB') {
      return;
    }
    if (
      [46, 8, 9, 27, 13, 110].indexOf(e.keyCode) !== -1 ||
      // Allow: Ctrl+A
      (e.keyCode === 65 && e.ctrlKey === true) ||
      // Allow: Ctrl+C
      (e.keyCode === 67 && e.ctrlKey === true) ||
      // Allow: Ctrl+V
      (e.keyCode === 86 && e.ctrlKey === true) ||
      // Allow: Ctrl+X
      (e.keyCode === 88 && e.ctrlKey === true)
    ) {
      // let it happen, don't do anything
      return;
    }
    if (
      ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].indexOf(e.key) === -1
    ) {
      e.preventDefault();
    }
  }

  noSpecialChars(event: KeyboardEvent) {
    const e = event;
    if (e.key === 'Tab' || e.key === 'TAB') {
      return;
    }
    const ch = e.key;
    const regEx = new RegExp(this.arabicRegex);
    if (regEx.test(ch)) {
      return;
    }
    e.preventDefault();
  }
  noSpecialCharFN(event: KeyboardEvent) {
    const e = event;
    if (e.key === 'Tab' || e.key === 'TAB') {
      return;
    }
    const ch = e.key;
    const regEx = new RegExp(this.arabicRegex4);
    if (regEx.test(ch)) {
      return;
    }
    e.preventDefault();
  }
  noSpecialChars1(event: KeyboardEvent) {
    const e = event;
    if (e.key === 'Tab' || e.key === 'TAB') {
      return;
    }
    const ch = e.key;
    const regEx = new RegExp(this.arabicRegex1);
    if (regEx.test(ch)) {
      return;
    }
    e.preventDefault();
  }
  noSpecialChars2(event: KeyboardEvent) {
    const e = event;
    if (e.key === 'Tab' || e.key === 'TAB') {
      return;
    }
    const ch = e.key;
    const regEx = new RegExp(this.arabicRegex2);
    if (regEx.test(ch)) {
      return;
    }
    e.preventDefault();
  }
  noSpecialChars3(event: KeyboardEvent) {
    const e = event;
    if (e.key === 'Tab' || e.key === 'TAB') {
      return;
    }
    const ch = e.key;
    const regEx = new RegExp(this.arabicRegex3);
    if (regEx.test(ch)) {
      return;
    }
    e.preventDefault();
  }

  noSpace(event: KeyboardEvent) {
    const e = event;
    if (e.key === 'Tab' || e.key === 'TAB') {
      return;
    }
    const ch = e.key;
    const regEx = new RegExp(/[\w]/);
    if (regEx.test(ch)) {
      return;
    }
    e.preventDefault();
  }

  @HostListener('paste', ['$event']) onPaste(event) {
    let regex;
    if (this.appInputRestriction === 'integer') {
      regex = /[0-9]/g;
    } else if (this.appInputRestriction === 'noSpecialChars') {
      regex = /[a-zA-Z0-9_]/g;
    }
    else if (this.appInputRestriction === 'noSpecialChars1') {
      regex = /[.a-zA-Z0-9_]/g;
    }
    else if (this.appInputRestriction === 'noSpecialChars2') {
      regex = /[@a-zA-Z0-9_]/g;
    }
    else if (this.appInputRestriction === 'noSpecialChars3') {
      regex = /[-a-zA-Z0-9_]/g;
    }
    const e = <ClipboardEvent>event;
    const pasteData = e.clipboardData.getData('text/plain');
    let m;
    let matches = 0;
    while ((m = regex.exec(pasteData)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === regex.lastIndex) {
        regex.lastIndex++;
      }
      // The result can be accessed through the `m`-variable.
      m.forEach((match, groupIndex) => {
        matches++;
      });
    }
    if (matches === pasteData.length) {
      return;
    } else {
      e.preventDefault();
    }
  }
}
