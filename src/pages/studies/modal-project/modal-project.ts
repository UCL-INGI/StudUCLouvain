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

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController }
        from 'ionic-angular';
import { StudiesService}
        from '../../../providers/studies-services/studies-service';
import { AdeProject } from '../../../app/entity/adeProject';

/**
 * Generated class for the ModalProjectPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-modal-project',
  templateUrl: 'modal-project.html',
})
export class ModalProjectPage {
  sessionId : string = this.navParams.get('sessionId');
  public projects;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public studiesService : StudiesService) {
  }

  closeModal(projectId : string) {
    console.log("closeModal projectId : " + projectId)
    this.studiesService.setProject(this.sessionId, projectId).then(
      data => {
        this.viewCtrl.dismiss(projectId);
      }
    )
  }

  getProjects(sessionId :string){
    this.studiesService.getProjects(sessionId).then(
      data => {
        console.log("data in getProjects");
        console.log(data);
        this.projects = data;
        console.log("this.projects[1].id" + this.projects[1].id)
        console.log("instanceof" + (this.projects[1] instanceof AdeProject));
        console.log("project.name : " + this.projects[0].name)
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalProjectPage');
    console.log("sessionId modal : "+ this.sessionId);
    this.getProjects(this.sessionId);
  }

}
