import { AbstractControl, ValidatorFn, FormControl, FormGroup } from '@angular/forms';

export function dateValidator(): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    let chosenDate;
    try {
      chosenDate = new Date(control.value);
    } catch (error) {
      chosenDate = null;
    }

    return (!chosenDate || chosenDate < new Date()) ? { invalidDate: {value: control.value }} : null;
  };
}
