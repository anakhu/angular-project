import { EventEmitter } from '@angular/core';

export abstract class StepBase {
  data: any;
  next: EventEmitter<any>;
  abstract onNext();
}
