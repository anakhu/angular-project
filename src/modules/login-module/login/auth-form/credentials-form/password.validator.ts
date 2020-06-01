import { AbstractControl, ValidatorFn  } from '@angular/forms';

export function passwordMatchValidator(): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    const isFormValid = control.value.password === control.value.confirmPassword;
    return !isFormValid ? { missmatch: {value: control.value }} : null;
  };
}
