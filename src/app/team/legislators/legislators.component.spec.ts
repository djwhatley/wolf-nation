import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LegislatorsComponent } from './legislators.component';

describe('LegislatorsComponent', () => {
  let component: LegislatorsComponent;
  let fixture: ComponentFixture<LegislatorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LegislatorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LegislatorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
