import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditPage } from './credit.page';

describe('CreditPage', () => {
  let component: CreditPage;
  let fixture: ComponentFixture<CreditPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
