import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MobilityPage } from './mobility.page';

describe('MobilityPage', () => {
  let component: MobilityPage;
  let fixture: ComponentFixture<MobilityPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobilityPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobilityPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
