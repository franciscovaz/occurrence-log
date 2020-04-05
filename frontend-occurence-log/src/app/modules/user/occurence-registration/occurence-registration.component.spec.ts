import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OccurenceRegistrationComponent } from './occurence-registration.component';

describe('OccurenceRegistrationComponent', () => {
  let component: OccurenceRegistrationComponent;
  let fixture: ComponentFixture<OccurenceRegistrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OccurenceRegistrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OccurenceRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
