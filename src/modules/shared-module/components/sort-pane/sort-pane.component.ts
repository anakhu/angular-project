import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { SortOptions } from 'src/app/shared/models/sortOptions';
import { StorageService } from 'src/app/shared/services/storage.service';
import { sortOptMap } from './sort-options';

@Component({
  selector: 'app-sort-pane',
  templateUrl: './sort-pane.component.html',
  styleUrls: ['./sort-pane.component.scss']
})
export class SortPaneComponent implements OnInit, AfterViewInit {
  options: SortOptions[] = [];
  @Input() sortRef: string;
  @Output() sortValChange = new EventEmitter();
  isSorted = false;

  constructor(
    private storage: StorageService
  ) { }

  ngOnInit(): void {}

  ngAfterViewInit() {
    Promise.resolve(null).then(() => this._getActiveFilter());
  }

  public handleClick(index: number) {
    this.options[index].order = this.options[index].order === 'ASC' ? 'DESC' : 'ASC';
    this.options[index].isActive = true;
    this.sortValChange.emit(this.options[index]);
    this._resetBtnsStatus(index);
    this.storage.addItem(this.sortRef, this.options);
    this.isSorted = true;
  }

  public reset(event: Event) {
    this._resetBtnsStatus(-1);
    this.isSorted = false;
    this.sortValChange.emit({field: '', order: 'ASC'});
    this.storage.clearStorage(this.sortRef);
  }

  private _getActiveFilter(): void{
    const sortVals = this.storage.getItem(this.sortRef);
    this.options = sortVals ? sortVals : sortOptMap[this.sortRef];
    this._checkActiveFilter(this.options);
  }

  private _checkActiveFilter(options: SortOptions[]) {
    for (const option of options) {
      if (option.isActive) {
        this.isSorted = true;
        const index = options.indexOf(option);
        this.sortValChange.emit(option);
        this._resetBtnsStatus(index);
        break;
      }
    }
  }

  private _resetBtnsStatus(index: number) {
    this.options.forEach((option: SortOptions) => {
      if (this.options.indexOf(option) !== index) {
        option.order = 'ASC';
        option.isActive = false;
      }
    });
  }
}
