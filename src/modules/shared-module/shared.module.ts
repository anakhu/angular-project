import { NgModule, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material-module/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CountrySelectComponent } from './components/forms/profile-form/country-select/country-select.component';
import { ProfileFormComponent } from './components/forms/profile-form/profile-form.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { AnchorDirective } from './components/wizard/anchor.directive';
import { WizardComponent} from './components/wizard/wizard.component';

const sharedComponents = [
  CountrySelectComponent,
  ProfileFormComponent,
  NotificationsComponent,
  AnchorDirective,
  WizardComponent,
];

@NgModule({
  declarations: [sharedComponents],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [sharedComponents],
})
export class SharedModule { }
