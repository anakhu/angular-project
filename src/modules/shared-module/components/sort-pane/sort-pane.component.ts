import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, OnDestroy } from '@angular/core';
import { SortOptions } from 'src/app/shared/models/sortOptions';
import { StorageService } from 'src/app/shared/services/storage/storage.service';
import { sortOptMap } from './sort-options';


@Component({
  selector: 'app-sort-pane',
  templateUrl: './sort-pane.component.html',
  styleUrls: ['./sort-pane.component.scss']
})
export class SortPaneComponent implements OnInit, OnDestroy, AfterViewInit {
  options: SortOptions[] = [];
  @Input() sortRef: string;
  @Output() sortValChange = new EventEmitter();
  sortOrder = false;
  sortValue = '';

  constructor(
    private storage: StorageService
  ) { }

  ngOnInit() {
    this.options = [...sortOptMap[this.sortRef]];
  }

  ngOnDestroy() {
    if (this.sortValue) {
      this._storeSortOptins();
    }
  }

  ngAfterViewInit() {
    Promise.resolve(null).then(() => this._getSortOptions());
  }

  public onSortOrderChange() {
    this.sortOrder = !this.sortOrder;
    this.emitSortVal();
  }

  public onSortFieldChange(event) {
    this.sortValue = event.value;
    this.emitSortVal();
  }

  public reset() {
    this.sortValue = '';
    this.sortOrder = false;
    this.emitSortVal();
    this.storage.clearStorage(this.sortRef);
  }

  private _getSortOptions() {
    const savedOptions = this.storage.getItem(this.sortRef);
    if (savedOptions) {
      this.sortValue = savedOptions.field;
      this.sortOrder = savedOptions.order !== 'ASC';
      this.emitSortVal();
    }
  }

  private emitSortVal() {
    const order = this.sortOrder ? 'DESC' : 'ASC';
    this.sortValChange.emit({ field: this.sortValue, order });
  }

  private _storeSortOptins() {
    const order = this.sortOrder ? 'DESC' : 'ASC';
    const activeSortVal = { field: this.sortValue, order };
    this.storage.addItem(this.sortRef, activeSortVal);
  }
}
