import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';
import { ErrorService } from '../../error.service/error.service';

@Component({
  selector: 'app-error-handler',
  templateUrl: './error-handler.component.html',
  styleUrls: ['./error-handler.component.scss']
})
export class ErrorHandlerComponent implements OnInit {
  @ViewChild(ToastContainerDirective, {static: true}) toastContainer: ToastContainerDirective;

  constructor(
    private toastrService: ToastrService,
    private errorService: ErrorService,
  ) {}

  ngOnInit(): void {
    this.toastrService.overlayContainer = this.toastContainer;
    this._subscribe();
  }

  private _subscribe(): void {
    this.errorService.createSubscription()
      .subscribe(
        (message: string) => {
          if (message) {
            this._showError(message);
          }
      });
  }

  private _showError(message: string, title: string = 'Error') {
    this.toastrService.error(title, message, {timeOut: 3000});
  }
}
