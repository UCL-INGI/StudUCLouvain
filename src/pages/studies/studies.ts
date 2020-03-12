import { catchError } from 'rxjs/operators';
/*
    Copyright (c)  Université catholique Louvain.  All rights reserved
    Authors :  Daubry Benjamin & Marchesini Bruno
    Date : July 2018
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
import {
  AlertController,
  MenuController,
  ModalController,
  NavController,
  NavParams,
  Platform,
  ToastController
} from '@ionic/angular';

import { Component } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Storage } from '@ionic/storage';

import { AdeProject } from '../../app/entity/adeProject';
import { Course } from '../../app/entity/course';
import { StudiesService } from '../../providers/studies-services/studies-service';
import { ConnectivityService } from '../../providers/utils-services/connectivity-service';
import { UtilsService } from '../../providers/utils-services/utils-service';
import { StudentService } from '../../providers/wso2-services/student-service';
import { Wso2Service } from '../../providers/wso2-services/wso2-service';
import { NavigationExtras } from "@angular/router";

@Component({
  selector: 'page-studies',
  templateUrl: 'studies.html'
})
export class StudiesPage {
  public data: any;
  segment = 'cours';
  public listCourses: Course[];
  public course: Course;
  public title: any;
  public sessionId: string;
  public project: AdeProject = null;
  public error = '';
  sigles: any;
  activities: any = [];
  response: any;
  language;
  statusInsc = '';
  prog = '';
  private username = '';
  private password = '';
  private status = '';

  constructor(
    public studiesService: StudiesService,
    public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController,
    public storage: Storage,
    public menu: MenuController,
    public toastCtrl: ToastController,
    public platform: Platform,
    private iab: InAppBrowser,
    public modalCtrl: ModalController,
    public connService: ConnectivityService,
    private wso2Service: Wso2Service,
    private studentService: StudentService,
    private utilsService: UtilsService
  ) {
    this.title = this.navParams.get('title');
    this.initializeSession();
    this.menu.enable(true, 'studiesMenu');
    this.getCourses();
  }

  checkExist(sigle: string) {
    const year = this.project.name.split('-')[0];
    return new Promise((resolve, reject) => {
      return this.studentService.checkCourse(sigle, year).then((data: any) => {
        const exist = data !== 404 && data !== 500;
        resolve({exist: exist, nameFR: exist ? data.title : '', nameEN: ''});
      }).catch(error => resolve(error));
    });
  }

  async toastBadCourse() {
    const toast = await this.studiesService.toastCourse('BADCOURSE');
    return await toast.present();
  }

  loadActivities() {
    if (this.connService.isOnline()) {
      this.login().then(() => {
        if (this.status) {
          this.studentService.searchActivities().then((res: any) => {
            this.sigles = res.activities.activity;
            for (const sigle of this.sigles) {
              this.activities.push({name: '', sigle: sigle});
            }
          }).catch(() => {
            console.log('Error during load of course program');
          });
          this.studentService.getStatus().then(res => {
            this.statusInsc = res[0].etatInscription;
            this.prog = res[0].intitOffreComplet;
          }).catch(() => {
            console.log('Error during load of inscription status');
          });
        }
      });
    } else {
      this.navCtrl.pop();
      this.connService.presentConnectionAlert();
    }
  }

  async openModalProject() {
    const myModal = await this.modalCtrl.create({
      component: 'ModalProjectPage',
      componentProps: {sessionId: this.sessionId}
    });
    await myModal.onDidDismiss().then(data => this.project = data.data);
    return await myModal.present();
  }

  initializeSession() {
    if (this.connService.isOnline()) {
      this.studiesService.openSession().then(sessId => {
        this.sessionId = sessId;
        this.storage.get('adeProject').then(data => {
          this.project = data;
          if (this.project === null) {
            this.openModalProject();
          } else {
            this.studiesService.setProject(this.sessionId, this.project.id);
          }
        });
      });
    } else {
      this.navCtrl.pop();
      this.connService.presentConnectionAlert();
    }
  }

  async showPrompt() {
    const alert = await this.alertCtrl.create({
      header: this.utilsService.getText('STUDY', 'ADDCOURSE'),
      message: this.utilsService.getText('STUDY', 'MESSAGE'),
      inputs: [
        {
          name: 'acronym',
          placeholder: this.utilsService.getText('STUDY', 'SIGLE')
        }
      ],
      buttons: [
        {
          text: this.utilsService.getText('STUDY', 'CANCEL'),
        },
        {
          text: this.utilsService.getText('STUDY', 'SAVE'),
          cssClass: 'save',
          handler: data => this.promptSaveHandler(data)
        }
      ]
    });
    return await alert.present();
  }

  async toastAlreadyCourse() {
    const toast = await this.studiesService.toastCourse('ALCOURSE');
    await toast.onDidDismiss().then(() => console.log('Dismissed toast'));
    return await toast.present();
  }

  addCourseFromProgram(acro: string) {
    let already = false;
    for (const item of this.listCourses) {
      if (item.acronym === acro) {
        already = true;
      }
    }
    if (!already) {
      this.checkExistAndAddOrToast(acro);
    } else {
      this.toastAlreadyCourse();
    }
  }

  async addCourse(sigle: string, name: string) {
    this.saveCourse(name, sigle);
    const toast = await this.toastCtrl.create({
      message: 'Cours ajouté',
      duration: 1000,
      position: 'bottom'
    });
    return await toast.present();
  }

  getCourses() {
    this.storage.get('listCourses').then(data => this.listCourses = data ? data : []);
  }

  saveCourse(name: string, tag: string) {
    this.listCourses.push(new Course(name, tag, null));
    this.storage.set('listCourses', this.listCourses);
  }

  removeCourse(course: Course) {
    const index = this.listCourses.indexOf(course);
    if (index >= 0) {
      this.listCourses.splice(index, 1);
    }
    this.storage.set('listCourses', this.listCourses);
  }

  openCoursePage(course: Course) {
    const navigationExtras: NavigationExtras = {
      state: {
        course: course,
        sessionId: this.sessionId,
        year: this.project.name.split('-')[0]
      }
    };
    this.navCtrl.navigateForward('CoursePage', navigationExtras);
  }

  async unavailableAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Indisponible',
      subHeader: 'Cette fonctionnalité n\'est pas encore disponible',
      buttons: ['OK']
    });
    return await alert.present();
  }

  openExamPage() {
    this.unavailableAlert();
  }

  launch(url) {
    this.iab.create(url, '_system');
  }

  private login() {
    this.error = '';
    return new Promise(resolve => {
      this.wso2Service.login(this.username, this.password).pipe(catchError(error => {
        if (error.status === 400) {
          this.error = this.utilsService.getText('STUDY', 'BADLOG');
        } else {
          this.error = this.utilsService.getText('STUDY', 'ERROR');
        }
        return error;
      })).subscribe(data => {
        if (data != null) {
          this.status = data.toString();
          resolve(data);
        }
      });
    });
  }

  private promptSaveHandler(data: any) {
    const acro = data.acronym.toUpperCase();
    let already = false;
    for (const item of this.listCourses) {
      if (item.acronym === acro) {
        already = true;
      }
    }
    already ? this.toastAlreadyCourse() : this.checkExistAndAddOrToast(acro);
  }

  private checkExistAndAddOrToast(acro: any) {
    this.checkExist(acro).then((check: any) => {
      if (check.exist) {
        this.addCourse(acro, check.nameFR);
      } else {
        this.toastBadCourse();
        this.showPrompt();
      }
    }).catch(err => {
      console.log(err);
    });
  }
}
