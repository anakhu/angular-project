import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowBarComponent } from './follow-bar.component';

describe('FollowBarComponent', () => {
  let component: FollowBarComponent;
  let fixture: ComponentFixture<FollowBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FollowBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
