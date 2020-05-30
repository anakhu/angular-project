import { NgModule, ModuleWithProviders, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorHandlerComponent } from './components/error-handler/error-handler.component';
import { ErrorService } from './error.service/error.service';
import { ToastrModule } from 'ngx-toastr';


@NgModule({
  declarations: [
    ErrorHandlerComponent,
  ],
  imports: [
    CommonModule,
    ToastrModule.forRoot(),
  ],
  exports: [
    ErrorHandlerComponent,
  ],
  entryComponents: [ErrorHandlerComponent]
})
export class ErrorHandlerModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: ErrorHandlerModule,
      providers: [
        {provide: ErrorHandler, useExisting: ErrorService},
      ]
    };
  }
}
