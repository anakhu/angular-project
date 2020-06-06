import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material-module/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CountrySelectComponent } from './components/forms/profile-form/country-select/country-select.component';
import { ProfileFormComponent } from './components/forms/profile-form/profile-form.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { AnchorDirective } from './components/wizard/anchor.directive';
import { WizardComponent} from './components/wizard/wizard.component';
import { ScrollerComponent } from './components/scroller/scroller.component';
import { FilterPipe } from './pipes/filter.pipe';
import { SortPipe } from './pipes/sort.pipe';
import { SearchFieldComponent } from './components/search-field/search-field.component';
import { SortPaneComponent } from './components/sort-pane/sort-pane.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ErrorPageComponent } from './components/error-page/error-page.component';
import { RouterModule } from '@angular/router';

const sharedComponents = [
  CountrySelectComponent,
  ProfileFormComponent,
  NotificationsComponent,
  AnchorDirective,
  WizardComponent,
  ScrollerComponent,
  FilterPipe,
  SearchFieldComponent,
  SortPipe,
  SortPaneComponent,
  ErrorPageComponent,
];

@NgModule({
  declarations: [sharedComponents],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    RouterModule
  ],
  exports: [sharedComponents],
})
export class SharedModule { }
