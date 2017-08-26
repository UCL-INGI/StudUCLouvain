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
import { Storage } from '@ionic/storage';

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
    public storage:Storage,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public studiesService : StudiesService) {
  }

  closeModal(project : AdeProject) {
    this.studiesService.setProject(this.sessionId, project.id).then(
      data => {
        this.storage.set('adeProject',project);
        this.viewCtrl.dismiss(project);
      }
    )
  }

  getProjects(sessionId :string){
    this.studiesService.getProjects(sessionId).then(
      data => {
        this.projects = data;
    });
  }

  ionViewDidLoad() {
    this.getProjects(this.sessionId);
  }

}
