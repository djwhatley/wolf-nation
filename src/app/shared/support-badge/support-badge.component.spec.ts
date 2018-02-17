import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportBadgeComponent } from './support-badge.component';

describe('SupportBadgeComponent', () => {
  let component: SupportBadgeComponent;
  let fixture: ComponentFixture<SupportBadgeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupportBadgeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
