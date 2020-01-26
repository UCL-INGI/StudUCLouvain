
import {
    AlertController, App, IonicModule, ModalController, NavController, NavParams
} from 'ionic-angular';

import { async, TestBed } from '@angular/core/testing';
import { Http, HttpModule } from '@angular/http';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';

import { NavParamsMock, TranslateServiceMock } from '../../../test-config/mocks-ionic';
import { GuindaillePage } from './guindaille2-0';

describe('Guindaille2-0', () => {
	let fixture;
	let component;
	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations:[GuindaillePage],
			imports: [	IonicModule.forRoot(this),
						TranslateModule.forRoot(this)],
			providers:[
				NavController,
				{provide:NavParams, useClass:NavParamsMock},
				//{provide:TranslateService, useClass: TranslateServiceMock},
				ModalController,
				AlertController,
			]
		})
	}));

	beforeEach(() =>{
		fixture = TestBed.createComponent(GuindaillePage);
		component = fixture.componentInstance;
		//expect(component).toBeDefined();
	});

	  it('should be created', () => {
	    expect(component instanceof GuindaillePage).toBe(true);
	  });
	  it('should create', () => {
    		expect(component).toBeDefined();
  		});
	  it('segment should be picto', () => {
	    expect(component.segment).toBe('pict', 'on picto at first');
	  });
});


