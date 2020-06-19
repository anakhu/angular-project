import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControlName } from '@angular/forms';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
})
export class UploadComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() formControlName: FormControlName;
  public file: File;

  constructor() { }

  ngOnInit(): void {}

  handleFileChange(event: any) {
    this.file = event.target.files[0];
  }
}
