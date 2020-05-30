import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';
import { NotificationsService } from '../../../../app/shared/services/notifications/notifications.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  @ViewChild(ToastContainerDirective, {static: true}) toastContainer: ToastContainerDirective;

  constructor(
    private toastrService: ToastrService,
    private notificationService: NotificationsService
  ) {}

  ngOnInit(): void {
    this.toastrService.overlayContainer = this.toastContainer;
    this._subscribe();
  }

  private _subscribe(): void {
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
}
