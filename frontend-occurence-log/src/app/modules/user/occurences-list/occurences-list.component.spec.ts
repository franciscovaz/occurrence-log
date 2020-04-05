import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OccurencesListComponent } from './occurences-list.component';

describe('OccurencesListComponent', () => {
  let component: OccurencesListComponent;
  let fixture: ComponentFixture<OccurencesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OccurencesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OccurencesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
