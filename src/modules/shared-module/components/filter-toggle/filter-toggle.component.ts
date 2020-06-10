import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { StorageService } from 'src/app/shared/services/storage/storage.service';

@Component({
  selector: 'app-filter-toggle',
  templateUrl: './filter-toggle.component.html',
  styleUrls: ['./filter-toggle.component.scss']
})
export class FilterToggleComponent implements OnInit, OnDestroy {
  @Input() checked = false;
  @Input() disabled = false;
  @Input() storageRef: string;
  @Input() label: string;
  @Output() toggleStatusChange = new EventEmitter();
  constructor(
    private storage: StorageService
  ) { }

  ngOnInit(): void {
    const status = this.storage.getItem(this.storageRef);
    if (typeof status === 'boolean') {
      this.checked = status;
      this.toggleStatusChange.emit(this.checked);
    }
  }

  ngOnDestroy(): void {
    this.storage.addItem(this.storageRef, this.checked);
  }

  onToggle() {
    this.checked = !this.checked;
    this.toggleStatusChange.emit(this.checked);
  }

}
