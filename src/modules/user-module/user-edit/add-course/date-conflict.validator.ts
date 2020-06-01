import { AbstractControl, ValidatorFn } from '@angular/forms';

export function dateConflictValidator(): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    let isFormValid;
    if (control.value.startDate && control.value.endDate) {
      const startDate = processDate(control.value.startDate);
      const endDate = processDate(control.value.endDate);
      isFormValid = isDateValid(startDate, endDate);
    }
    return !!isFormValid ?  null :  { dateConflict: {value: control.value }};
  };
}

function processDate(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  return new Date(year, month, day);
}

function isDateValid(date1: Date, date2: Date) {
  if ((date2.getTime() - date1.getTime()) < 3600 * 24) {
    return false;
  }
  return true;
}
