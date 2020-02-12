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
    AlertController, IonicPage, MenuController, ModalController, NavController, NavParams, Platform,
    ToastController
} from 'ionic-angular';

import { Component } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';

import { AdeProject } from '../../app/entity/adeProject';
import { Course } from '../../app/entity/course';
import { StudiesService } from '../../providers/studies-services/studies-service';
import { ConnectivityService } from '../../providers/utils-services/connectivity-service';
import { StudentService } from '../../providers/wso2-services/student-service';
import { Wso2Service } from '../../providers/wso2-services/wso2-service';

@IonicPage()
@Component({
  selector: 'page-studies',
  templateUrl: 'studies.html'
})
export class StudiesPage {
  public people: any;
  public data: any;
  segment = 'prog';
  public listCourses: Course[];
  public course: Course;
  public title: any;
  public sessionId: string;
  public project: AdeProject = null;
  private username = '';
  private password = '';
  public error = '';
  private status = '';
  sigles: any;
  activities: any = [];
  response: any;
  language;
  statusInsc = '';
  prog = '';

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
    private translateService: TranslateService,
    private wso2Service: Wso2Service,
    private studentService: StudentService
  ) {
    this.title = this.navParams.get('title');

    this.initializeSession();
    this.menu.enable(true, 'studiesMenu');
    this.getCourses();
  }

  checkExist(sigle: string): Promise<any> {
    let response: any;
    const year = this.project.name.split('-')[0];
    return new Promise(resolve => {
      this.studentService.checkCourse(sigle, year).then((data: any) => {
        const exist = data !== 404 && data !== 500;
        let nameFR = '';
        let nameEN = '';
        if (exist === true) {
          const names = data.title;
          nameFR = names;
          nameEN = '';
        }
        response = { exist: exist, nameFR: nameFR, nameEN: nameEN };
        resolve(response);
      });
    });
  }

  toastBadCourse() {
    let msg: string;
    this.translateService.get('STUDY.BADCOURSE').subscribe((res: string) => {
      msg = res;
    });
    const toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'middle'
    });
    toast.present();
  }

  private login() {
    this.error = '';
    return new Promise(resolve => {
      this.wso2Service.login(this.username, this.password).catch(error => {
        if (error.status === 400) {
          this.translateService.get('STUDY.BADLOG').subscribe((res: string) => {
            this.error = res;
          });
        } else {
          this.translateService.get('STUDY.ERROR').subscribe((res: string) => {
            this.error = res;
          });
        }
        return error;
      })
        .subscribe(data => {
          if (data != null) {
            this.status = data.toString();
            resolve(data);
          }
        });
    });
  }

  loadActivities() {
    if (this.connService.isOnline()) {
      this.login().then(() => {
        if (this.status) {
          this.studentService
            .searchActivities()
            .then(res => {
              const result: any = res;
              this.sigles = result.activities.activity;
              for (const sigle of this.sigles) {
                this.activities.push({ name: '', sigle: sigle });
              }
            })
            .catch(err => {
              console.log('Error during load of course program');
            });

          this.studentService
            .getStatus()
            .then(res => {
              const result: any = res;
              this.statusInsc = result[0].etatInscription;
              this.prog = result[0].intitOffreComplet;
            })
            .catch(err => {
              console.log('Error during load of inscription status');
            });
        }
      });
    } else {
      this.navCtrl.pop();
      this.connService.presentConnectionAlert();
    }
  }

  openModalProject() {
    const obj = { sessionId: this.sessionId };
    const myModal = this.modalCtrl.create('ModalProjectPage', obj);
    myModal.onDidDismiss(data => {
      this.project = data;
    });
    myModal.present();
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
            this.studiesService
              .setProject(this.sessionId, this.project.id);
          }
        });
      });
    } else {
      this.navCtrl.pop();
      this.connService.presentConnectionAlert();
    }
  }

  showPrompt() {
    let addcourse: string;
    let message: string;
    let sigle: string;
    let cancel: string;
    let save: string;
    this.translateService.get('STUDY.ADDCOURSE').subscribe((res: string) => {
      addcourse = res;
    });
    this.translateService.get('STUDY.MESSAGE').subscribe((res: string) => {
      message = res;
    });
    this.translateService.get('STUDY.SIGLE').subscribe((res: string) => {
      sigle = res;
    });
    this.translateService.get('STUDY.CANCEL').subscribe((res: string) => {
      cancel = res;
    });
    this.translateService.get('STUDY.SAVE').subscribe((res: string) => {
      save = res;
    });
    const prompt = this.alertCtrl.create({
      title: addcourse,
      message: message,
      inputs: [
        {
          name: 'acronym',
          placeholder: sigle
        }
      ],
      buttons: [
        {
          text: cancel,
          handler: data => { }
        },
        {
          text: save,
          cssClass: 'save',
          handler: data => {
            const acro = data.acronym.toUpperCase();
            let already = false;
            for (const item of this.listCourses) {
              if (item.acronym === acro) { already = true; }
            }
            if (!already) {
              this.checkExistAndAddOrToast(acro);
            } else {
              this.toastAlreadyCourse();
            }
          }
        }
      ]
    });
    prompt.present();
  }

  private checkExistAndAddOrToast(acro: any) {
    this.checkExist(acro).then(check => {
      if (check.exist) {
        this.addCourse(acro, check.nameFR);
      } else {
        this.toastBadCourse();
        this.showPrompt();
      }
    });
  }

  toastAlreadyCourse() {
    let msg: string;
    this.translateService.get('STUDY.ALCOURSE').subscribe((res: string) => {
      msg = res;
    });
    const toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'middle'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
    toast.present();
  }

  addCourseFromProgram(acro: string) {
    let already = false;
    for (const item of this.listCourses) {
      if (item.acronym === acro) { already = true; }
    }
    if (!already) {
      this.checkExistAndAddOrToast(acro);
    } else {
      this.toastAlreadyCourse();
    }
  }

  addCourse(sigle: string, name: string) {
    this.saveCourse(name, sigle);
    const toast = this.toastCtrl.create({
      message: 'Cours ajouté',
      duration: 1000,
      position: 'bottom'
    });
    toast.present();
  }

  getCourses() {
    this.storage.get('listCourses').then(data => {
      if (data == null) {
        this.listCourses = [];
      } else {
        this.listCourses = data;
      }
    });
  }

  saveCourse(name: string, tag: string) {
    const course = new Course(name, tag, null);
    this.listCourses.push(course);
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
    const year = this.project.name.split('-')[0];
    this.navCtrl.push('CoursePage', {
      course: course,
      sessionId: this.sessionId,
      year: year
    });
  }

  unavailableAlert() {
    const alert = this.alertCtrl.create({
      title: 'Indisponible',
      subTitle: 'Cette fonctionnalité n\'est pas encore disponible',
      buttons: ['OK']
    });
    alert.present();
  }

  openExamPage() {
    this.unavailableAlert();
  }

  launch(url) {
    this.iab.create(url, '_system');
  }
}
