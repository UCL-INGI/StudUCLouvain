
import { async, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { NavController, NavParams, ModalController, App } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { TranslateModule, TranslateLoader} from "@ngx-translate/core";

import {GuindaillePage} from './guindaille2-0';

import {NavParamsMock, TranslateServiceMock} from '../../../test-config/mocks-ionic';


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


