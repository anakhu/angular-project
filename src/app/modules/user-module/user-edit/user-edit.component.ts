import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { StepBase } from 'src/app/modules/shared-module/components/wizard/step-.base';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { Subscription, Observable } from 'rxjs';
import { User } from 'src/app/shared/models/user/user';
import { LoggedInUser } from 'src/app/shared/models/user/loggedInUser';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducer';
import { selectAuthUserUid } from 'src/app/store/auth/auth.selectors';

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
  authUserId$: Observable<string>;

  constructor(
    private store: Store<AppState>,
    ) {
    super();
  }

  ngOnInit(): void {
    this.authUserId$ = this.store.select(selectAuthUserUid);
  }

  ngOnDestroy(): void {}

  onNext() {
    this.next.emit({nextStep: 0});
  }
}
