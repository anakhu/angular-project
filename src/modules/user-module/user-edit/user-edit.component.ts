import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { StepBase } from 'src/modules/shared-module/components/wizard/step-.base';
import { AuthService, FireBaseUser } from 'src/app/shared/services/auth/auth.service';
import { Subscription } from 'rxjs';
import { UsersService } from 'src/app/shared/services/users/users.service';
import { User } from 'src/app/shared/models/user';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent extends StepBase implements OnInit, OnDestroy {
  componentList: any;
  @Output() next: EventEmitter<any> = new EventEmitter<any>();
  @Output() transerUpdates: EventEmitter<User> = new EventEmitter<User>();

  authUser: FireBaseUser;
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
      .subscribe((user: FireBaseUser) => this.authUser = user ? user : null);
  }

  onNext() {
    this.next.emit({nextStep: 0});
  }
}
