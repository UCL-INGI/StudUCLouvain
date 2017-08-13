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
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import X2JS from 'x2js';
/*
  Generated class for the AdeserviceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AdeService {
  AdeserviceBaseUrl : string = "http://horaire.uclouvain.be/jsp/webapi?";
  AdeserviceConnection : string = "function=connect&login=etudiant&password=student";
  AdeServiceGetProjects : string = "&function=getProjects&detail=2";
  constructor(public http: Http) {
    console.log('Hello Adeservice Provider');

  }

  convertXmlToJson(xml) : any{
    let parser : any = new X2JS();
    let json = parser.xml2js(xml);
    console.log("json");
    console.log(json);
    return json;
  }

  httpOpenSession() {
    let encodedURL : string = this.AdeserviceBaseUrl + this.AdeserviceConnection;
    return this.http.get(encodedURL).map(res => {
      return this.convertXmlToJson(res.text());
    })
  }

  httpGetProjects(sessionId : string){
    let encodedURL : string = this.AdeserviceBaseUrl
                              +"sessionId="+sessionId
                              +this.AdeServiceGetProjects;
    return this.http.get(encodedURL).map( res => {
      return this.convertXmlToJson(res.text());
     })
  }

  httpSetProject(sessionId :string, projectId : string){
    let encodedURL : string = this.AdeserviceBaseUrl
                              +"sessionId="+sessionId
                              +"&function=setProject&projectId="+ projectId;
    return this.http.get(encodedURL).map( res => {
      return this.convertXmlToJson(res.text());
     })
  }



}