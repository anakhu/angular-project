import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { StepBase } from 'src/app/modules/shared-module/components/wizard/step-.base';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { Subscription } from 'rxjs';
import { User } from 'src/app/shared/models/user/user';
import { LoggedInUser } from 'src/app/shared/models/user/loggedInUser';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent extends StepBase implements OnInit, OnDestroy {
  componentList: any;
  @Output() next: EventEmitter<any> = new EventEmitter<any>();
  @Output() transerUpdates: EventEmitter<User> = new EventEmitter<User>();

  authUser: LoggedInUser;
  authSubscription: Subscription;

  constructor(
    private auth: AuthService,
    ) {
    super();
  }

  ngOnInit(): void {
    this._subscribe();
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

  private _subscribe() {
    this.authSubscription = this.auth.createSubscription()
      .subscribe((user: LoggedInUser) => this.authUser = user ? user : null);
  }

  onNext() {
    this.next.emit({nextStep: 0});
  }
}
