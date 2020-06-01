import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { of } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-search-field',
  templateUrl: './search-field.component.html',
  styleUrls: ['./search-field.component.scss']
})
export class SearchFieldComponent implements OnInit {
  @Output() newKeyEvent = new EventEmitter<string>();
  @Input() filterStr = '';
  @Input() name = '';
  constructor() { }

  ngOnInit(): void {}

  onChange(event: Event) {
    of(event)
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
      )
      .subscribe(() => this.notifyParent());
  }

  notifyParent() {
    this.newKeyEvent.emit(this.filterStr);
  }
}
