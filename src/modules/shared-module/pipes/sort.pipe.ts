import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sort',
})
export class SortPipe implements PipeTransform {
  transform(value: any, sortVal: any, order: string = 'ASC', initialVal: any, covertVal?: string): any {
    switch (true) {
      case typeof value[0][sortVal] === 'string' && sortVal === 'startDate':
        return sortDates(value, order, sortVal);
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

function getLength(value: any) {
  if (!value) {
    return 0;
  }
  return value.length;
}


function sortDates(array: any, order: string, sortVal: string) {
  try {
    const sorted = [...array].sort((a, b) => order === 'ASC'
      ? parseDate(a[sortVal]) - parseDate(b[sortVal])
      : parseDate(b[sortVal]) - parseDate(a[sortVal]));
    return sorted;
  } catch (error) {
    return array;
  }
}


function parseDate(value: string) {
  const date = Date.parse(value);
  if (!isNaN(date)) {
    return date;
  }
  throw Error('Invalid date');
}
