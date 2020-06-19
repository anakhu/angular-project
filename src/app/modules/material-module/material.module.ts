import { NgModule } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

const MaterialComponents = [
  FormsModule,
  MatSidenavModule,
  LayoutModule,
  MatToolbarModule,
  MatButtonModule,
  MatIconModule,
  MatListModule,
  MatCardModule,
  MatTabsModule,
  MatGridListModule,
  MatDividerModule,
  MatInputModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatSelectModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatTooltipModule,
  MatBadgeModule,
  MatProgressSpinnerModule,
  MatDialogModule,
  MaterialFileInputModule,
  MatCheckboxModule,
  MatRadioModule,
  MatSlideToggleModule
];

@NgModule({
  imports: [ MaterialComponents ],
  exports: [ MaterialComponents ],
  providers: [
    MatDatepickerModule,
    MatNativeDateModule,
  ],
})
export class MaterialModule { }
