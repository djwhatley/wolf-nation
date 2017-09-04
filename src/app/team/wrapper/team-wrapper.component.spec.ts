import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamWrapperComponent } from './team-wrapper.component';

describe('WrapperComponent', () => {
  let component: TeamWrapperComponent;
  let fixture: ComponentFixture<TeamWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
