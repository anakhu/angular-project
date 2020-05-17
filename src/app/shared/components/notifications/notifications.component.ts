import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';
import { ErrorService } from '../../services/error/error.service';
import { Subscription } from 'rxjs';
import { NotificationsService } from '../../services/notifications/notifications.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  @ViewChild(ToastContainerDirective, {static: true}) toastContainer: ToastContainerDirective;

  constructor(
    private toastrService: ToastrService,
    private errorService: ErrorService,
    private notificationService: NotificationsService
  ) { }

  ngOnInit(): void {
    this.toastrService.overlayContainer = this.toastContainer;
    this._subscribe();
  }

  private _subscribe(): void {
    this.errorService.subscribe()
      .subscribe((error: Error) => {
        if (error instanceof Error) {
          this._showError(error.message);
        }
      });
    this.notificationService.subscribe()
      .subscribe((notification: Notification) => {
        if (notification) {
          this._showSuccess(notification.body);
        }
      });
  }

  private _showSuccess(message: string, title: string = 'Success') {
    this.toastrService.success(message, title, { timeOut: 3000 });
  }

  private _showError(message: string, title: string = 'Error') {
    this.toastrService.error(title, message, {timeOut: 3000});
  }
}

