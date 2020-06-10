import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toggle',
})
export class TogglePipe implements PipeTransform {
  transform(currentValue: any, filterBase: string, filterVal?: boolean): any {
    const displayedItems = currentValue
      .filter((item: any) => {
        if (filterVal) {
          return item[filterBase] === filterVal;
        } else {
          return item;
        }
      });
    return displayedItems;
  }
}
