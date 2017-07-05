/*
    Copyright 2017 Lamy Corentin, Lemaire Jerome

    This file is part of UCLCampus.

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

import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';


@Injectable()
export class LibrariesService {
  libraries : any = [];
  url = 'https://esb-test.sipr.ucl.ac.be:8248/libraries/v1/list';
  test_url = 'assets/data/temp_libraries.json';
  test_url_details = 'assets/data/temp_library_33.json';
  options: any;

  constructor(public http: Http) {
    let headers = new Headers({ 'Accept': 'application/json' });
    headers.append('Authorization', `Bearer b1f03f08-fcd7-3834-9e28-ba91d462ad24`);
    this.options = new RequestOptions({ headers: headers });
  }

  public loadLibraries(){
    return new Promise(resolve => {

      this.http.get(this.url, this.options)
        .map(res => res.json()).subscribe(data => {
          resolve(data.return.library);
        });

      });
  }

  public loadLibDetails(id: string){
    return new Promise(resolve => {

      let url_details = this.url + '/' + id;

      this.http.get(url_details, this.options)
        .map(res => res.json()).subscribe(data => {
          resolve(data.return.library);
        });

      });
  }

}
