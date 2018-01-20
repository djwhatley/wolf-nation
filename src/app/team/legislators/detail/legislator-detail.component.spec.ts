import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LegislatorDetailComponent } from './legislator-detail.component';

describe('LegislatorDetailComponent', () => {
  let component: LegislatorDetailComponent;
  let fixture: ComponentFixture<LegislatorDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LegislatorDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LegislatorDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
