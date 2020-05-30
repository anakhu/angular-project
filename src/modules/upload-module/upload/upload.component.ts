import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControlName } from '@angular/forms';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
})
export class UploadComponent implements OnInit {
  file: File;
  @Input() form: FormGroup;
  @Input() formControlName: FormControlName;

  constructor() { }

  ngOnInit(): void {}

  handleFileChange(event: any) {
    this.file = event.target.files[0];
  }
}
