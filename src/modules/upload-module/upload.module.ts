import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UploadComponent } from '../upload-module/upload/upload.component';
import { MaterialModule } from '../material-module/material.module';


@NgModule({
  declarations: [
    UploadComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
  exports: [
    UploadComponent
  ]
})
export class UploadModule { }
