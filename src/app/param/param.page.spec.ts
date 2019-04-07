import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParamPage } from './param.page';

describe('ParamPage', () => {
  let component: ParamPage;
  let fixture: ComponentFixture<ParamPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParamPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParamPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
