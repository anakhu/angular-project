import { AbstractControl, ValidatorFn, Validator, NG_VALIDATORS } from '@angular/forms';
import { Directive, Input } from '@angular/core';


export function validateUserEmail(emailValue: string): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    const result = emailValue !== control.value;
    return result ? { emailMatch: { value: control.value } } : null;
  };
}

@Directive({
  selector: '[appUserEmail]',
  providers: [{provide: NG_VALIDATORS, useExisting: EmailMatchValidator, multi: true }]
})
export class EmailMatchValidator implements Validator {
  @Input('appUserEmail') email: string;

  constructor() {}

  validate(control: AbstractControl): {[key: string]: any} | null {
    return this.email
      ? validateUserEmail(this.email)(control)
      : { authEmail: { value: 'unauthorized' }} ;
  }
 }
