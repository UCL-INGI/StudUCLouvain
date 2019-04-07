import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudiesPage } from './studies.page';

describe('StudiesPage', () => {
  let component: StudiesPage;
  let fixture: ComponentFixture<StudiesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudiesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudiesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
