import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VolunteerMapComponent } from './volunteer-map.component';

describe('VolunteerMapComponent', () => {
  let component: VolunteerMapComponent;
  let fixture: ComponentFixture<VolunteerMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VolunteerMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VolunteerMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
