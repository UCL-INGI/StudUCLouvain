/*
    Copyright (c)  Université catholique Louvain.  All rights reserved
    Authors :  Jérôme Lemaire and Corentin Lamy
    Date : July 2017
    This file is part of UCLCampus
    Licensed under the GPL 3.0 license. See LICENSE file in the project root for full license information.

    UCLCampus is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    UCLCampus is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with UCLCampus.  If not, see <http://www.gnu.org/licenses/>.
*/

import { async, TestBed, inject } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { Http,HttpModule, ResponseOptions, BaseRequestOptions, Response } from '@angular/http';

import { RssService } from './rss-service';
import { NewsItem } from '../../app/entity/newsItem';
import { IonicModule } from 'ionic-angular';

import { NewsService } from './news-service'


import {RssServiceMock} from '../../../test-config/mocks-ionic';
import {MockBackend} from '@angular/http/testing';

 
describe('NewsService', () => {
 
    beforeEach(async(() => {
 
        TestBed.configureTestingModule({
 
            declarations: [
 
            ],
 
            providers: [
                NewsService,
                MockBackend,
                RssService,
                BaseRequestOptions,
                {
                    provide: Http,
                    useFactory: (mockBackend, options) => {
                        return new Http(mockBackend, options);
                    },
                    deps: [MockBackend, BaseRequestOptions]
                }
            ],
 
            imports: [
                HttpModule
            ]
 
        }).compileComponents();
 
    }));
 
    beforeEach(() => {
 
    });
 
    it('should have a non empty array called products', inject([NewsService, MockBackend], (newsService, mockBackend) => {
 
        const mockResponse = '{"products": [{"description":"blabla","link":"http://","title"="oulala","image":"null","trimmedDescription":"trimmed","hidden":"false","guid":"0","pubDate":"23/04/2018"},{"description":"blablaterre","link":"http://dddddddd","title"="oulalacavaetredur","image":"null","trimmedDescription":"trimmed","hidden":"false","guid":"1","pubDate":"23/05/2018"},{"description":"blibli","link":"http://dada","title"="ouch","image":"null","trimmedDescription":"trimmed","hidden":"false","guid":"2","pubDate":"24/04/2018"}] }';
 
        mockBackend.connections.subscribe((connection) => {
 
            connection.mockRespond(new Response(new ResponseOptions({
                body: mockResponse
            })));
 
        });
 
        newsService.getNews("P1");
 
        expect(Array.isArray(newsService.news)).toBeTruthy();
        expect(newsService.news.length).toBeGreaterThan(0);
 
    }));
 
 
});