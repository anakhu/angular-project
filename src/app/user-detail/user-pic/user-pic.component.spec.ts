import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPicComponent } from './user-pic.component';

describe('UserPicComponent', () => {
  let component: UserPicComponent;
  let fixture: ComponentFixture<UserPicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserPicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
