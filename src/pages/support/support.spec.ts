/**
 Copyright (c)  Université catholique Louvain.  All rights reserved
 Authors: Benjamin Daubry & Bruno Marchesini and Jérôme Lemaire & Corentin Lamy
 Date: 2018-2019
 This file is part of Stud.UCLouvain
 Licensed under the GPL 3.0 license. See LICENSE file in the project root for full license information.
 Stud.UCLouvain is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.
 Stud.UCLouvain is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.
 You should have received a copy of the GNU General Public License
 along with Stud.UCLouvain.  If not, see <http://www.gnu.org/licenses/>.
 */
import { SupportPage } from './support';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import {
  AlertController,
  LoadingController,
  ModalController,
  NavController,
  NavParams,
  Platform,
  ToastController,
  ViewController
} from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import {
  LoadingControllerMock,
  MockAlertController,
  NavParamsMock,
  newModalControllerMock,
  newToastControllerMock,
  newViewControllerMock,
  PlatformMock,
  UserServiceMock
} from "../../../test-config/mocks-ionic";
import { RepertoireService } from "../../providers/wso2-services/repertoire-service";
import { Wso2Service } from "../../providers/wso2-services/wso2-service";
import { ConnectivityService } from "../../providers/utils-services/connectivity-service";
import { Network } from "@ionic-native/network";
import { UtilsService } from "../../providers/utils-services/utils-service";
import { Device } from "@ionic-native/device";
import { AppAvailability } from "@ionic-native/app-availability";
import { Market } from "@ionic-native/market";
import { UserService } from "../../providers/utils-services/user-service";

describe('Support Component', () => {
  let fixture;
  let component;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SupportPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        TranslateModule.forRoot(),
        HttpClientTestingModule,
      ],
      providers: [
        InAppBrowser,
        NavController,
        {provide: NavParams, useClass: NavParamsMock},
        {
          provide: ModalController, useFactory: () => {
            return newModalControllerMock();
          }
        },
        {provide: Platform, useClass: PlatformMock},
        RepertoireService,
        Wso2Service,
        ConnectivityService,
        Network,
        {provide: AlertController, useClass: MockAlertController},
        UtilsService,
        {provide: LoadingController, useClass: LoadingControllerMock},
        Device,
        AppAvailability,
        Market,
        {provide: UserService, useClass: UserServiceMock},
        {
          provide: ToastController, useFactory: () => {
            return newToastControllerMock();
          }
        },
        {provide: ViewController, useFactory: () => {
            return newViewControllerMock();
          }},
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(component instanceof SupportPage).toBeTruthy();
  });
});
