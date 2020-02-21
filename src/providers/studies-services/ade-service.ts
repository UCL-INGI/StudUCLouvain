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

import X2JS from 'x2js';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class AdeService {
  AdeserviceBaseUrl = 'http://horaire.uclouvain.be/jsp/webapi?';
  AdeserviceConnection = 'function=connect&login=' + 'etudiant' + '&password=' + 'student';
  AdeServiceGetProjects = '&function=getProjects&detail=2';
  AdeUrlWithSessionId = this.AdeserviceBaseUrl + 'sessionId=';
  constructor(public http: HttpClient) {
  }

  convertXmlToJson(xml): any {
    return new X2JS().xml2js(xml);
  }

  load(url: string) {
    return this.http.get(url, {responseType: 'text'}).map(res => {
      return this.convertXmlToJson(res);
    });
  }

  httpOpenSession() {
    return this.load(this.AdeserviceBaseUrl + this.AdeserviceConnection);
  }

  httpGetProjects(sessionId: string) {
    return this.load(this.AdeUrlWithSessionId + sessionId + this.AdeServiceGetProjects);
  }

  httpSetProject(sessionId: string, projectId: string) {
    return this.load(this.AdeUrlWithSessionId + sessionId + '&function=setProject&projectId=' + projectId);
  }

  httpGetCourseId(sessionId: string, acronym: string) {
    return this.load(this.AdeUrlWithSessionId + sessionId + '&function=getResources&code=' + acronym);
  }

  httpGetActivity(sessionId: string, courseId: string) {
    return this.load(
      this.AdeUrlWithSessionId + sessionId + '&function=getActivities&resources=' + courseId + '&detail=17'
    );
  }
}
