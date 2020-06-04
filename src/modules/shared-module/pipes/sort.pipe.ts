import { Pipe, PipeTransform } from '@angular/core';

function getLength(value) {
  if (!value) {
    return 0;
  }
  return value.length;
}

@Pipe({
  name: 'sort',
})
export class SortPipe implements PipeTransform {
  transform(value: any, sortVal: any, order: string = 'ASC', initialVal: any): any {
    switch (true) {
      case typeof value[0][sortVal] === 'string':
        return [...value].sort((a, b) => {
          if (order === 'ASC') {
            return a[sortVal].toLowerCase() > b[sortVal].toLowerCase() ? -1 : 1;
          } else {
            return a[sortVal].toLowerCase() < b[sortVal].toLowerCase() ? -1 : 1;
          }
        });
      case typeof value[0][sortVal] === 'number':
        return [...value].sort((a, b) => order === 'ASC'
          ? a[sortVal] - b[sortVal]
          : b[sortVal] - a[sortVal]);
      case Array.isArray(value[0][sortVal]) || !(value[0][sortVal]):
        return [...value].sort((a, b) => order === 'ASC'
          ? getLength(a[sortVal]) - getLength(b[sortVal])
          : getLength(b[sortVal]) - getLength(a[sortVal]));
      case typeof value[0][sortVal] === 'boolean':
        console.log('boolean');
        return [...initialVal];
      default:
        console.log('default');
        return [...initialVal];
    }
  }
}
