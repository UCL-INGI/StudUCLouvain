import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutoPage } from './tuto.page';

describe('TutoPage', () => {
  let component: TutoPage;
  let fixture: ComponentFixture<TutoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
