import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[app-anchor]',
})

export class AnchorDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
