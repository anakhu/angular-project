import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sort',
})
export class SortPipe implements PipeTransform {
  transform(value: any, sortVal: any, order: string = 'ASC', initialVal: any): any {
    switch (true) {
      case typeof value[0][sortVal] === 'string':
        return sortStrings(value, order, sortVal);
      case typeof value[0][sortVal] === 'number':
        return sortNumbers(value, order, sortVal);
      case Array.isArray(value[0][sortVal]) || !(value[0][sortVal]):
        return sortByArrayLength(value, order, sortVal);
      default:
        return [...initialVal];
    }
  }
}

function sortNumbers(array: any, order: string, sortVal: string) {
  return [...array].sort((a, b) => order === 'ASC' ? a[sortVal] - b[sortVal] : b[sortVal] - a[sortVal]);
}

function sortStrings(array: any, order: string, sortVal: string) {
  return [...array].sort((a, b) => {
    if (order === 'ASC') {
      return a[sortVal].toLowerCase() > b[sortVal].toLowerCase() ? -1 : 1;
    } else {
      return a[sortVal].toLowerCase() < b[sortVal].toLowerCase() ? -1 : 1;
    }
  });
}

function sortByArrayLength(array: any, order: string, sortVal: string) {
  return [...array].sort((a, b) => order === 'ASC'
    ? getLength(a[sortVal]) - getLength(b[sortVal])
    : getLength(b[sortVal]) - getLength(a[sortVal]));
}

function getLength(value) {
  if (!value) {
    return 0;
  }
  return value.length;
}
