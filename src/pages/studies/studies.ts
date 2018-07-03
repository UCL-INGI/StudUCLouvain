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
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { AlertController, MenuController, ModalController, ItemSliding, ToastController } from 'ionic-angular';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';

import { StudiesService} from '../../providers/studies-services/studies-service';
import { StudentService} from '../../providers/wso2-services/student-service';
import { Wso2Service} from '../../providers/wso2-services/wso2-service';
import { Course } from '../../app/entity/course';
import { AdeProject } from '../../app/entity/adeProject';

import { CoursePage } from '../studies/course/course';
import { ModalProjectPage } from './modal-project/modal-project';
//import { Activity } from '../../app/entity/activity';
import { Calendar } from '@ionic-native/calendar';
import { ConnectivityService } from '../../providers/utils-services/connectivity-service';


@Component({
  selector: 'page-studies',
  templateUrl: 'studies.html',

})
export class StudiesPage {
  public people: any;
  public data : any;
  segment = 'prog';
  public listCourses: Course[];
  public course : Course;
  public title: any;
  public sessionId: string;
  public project : AdeProject = null;
  private username:string = "";
  private password: string = "";
  private error:string = "";
  private status: string = "";
  //private token:string = "";
  activities: any;

  constructor(
    public studiesService: StudiesService,
    public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController,
    public storage:Storage,
    public menu: MenuController,
    private calendar: Calendar,
    public toastCtrl: ToastController,
    public platform: Platform,
    private iab: InAppBrowser,
    public modalCtrl: ModalController,
    public connService : ConnectivityService,
              private translateService: TranslateService,
              private wso2Service: Wso2Service,
              private studentService: StudentService
  ) {
    this.title = this.navParams.get('title');

    this.initializeSession();
    this.menu.enable(true, "studiesMenu");
    this.getCourses();
  }


  private login(){
  	//console.log("username",this.username);
  	//console.log("pass",this.password);
  	this.error = "";
  	return new Promise(resolve => {

      this.wso2Service.login(this.username,this.password)
      .catch(error => {
      	console.log(error);
      	if(error.status == 400) this.translateService.get('STUDY.BADLOG').subscribe((res:string) => {this.error=res;});
      	else this.translateService.get('STUDY.ERROR').subscribe((res:string) => {this.error=res;});
      	return error;
      })
      .subscribe(
        data => {
          if(data!=null){
            this.status=data.toString();
            //console.log(this.status);
            resolve(data);
          }
        })
      ;
    });
  }

  loadActivities(){
  	//console.log(this.status);

  	this.login().then((res) => {
	  	//console.log(this.status);
	  	if(this.status){
	  		//console.log("chelou");
	  		this.studentService.searchActivities().then((res) => {
	  			let result:any = res;
	  			this.activities = result.activities.activity;
	  			console.log(this.activities.activity);
	  		});

	  	}
  	});

  }

  openModalProject(){
    let obj = {sessionId : this.sessionId};

    let myModal = this.modalCtrl.create(ModalProjectPage, obj);
    myModal.onDidDismiss(data => {
      this.project = data;
    });
    myModal.present();
  }

  initializeSession(){
    if(this.connService.isOnline()) {
      this.studiesService.openSession().then(
        data => {
          this.sessionId = data;
          this.storage.get('adeProject').then(
            (data) => {
              this.project=data;
              if (this.project === null) {
                this.openModalProject();
              } else {
                this.studiesService.setProject(this.sessionId,this.project.id).then(
                  data => {
                    console.log("setProject");
                  }
                );
              }
            }
          )
      });
    }  
     else {
      this.connService.presentConnectionAlert();
    }
  }




  showPrompt() {
    let addcourse:string;
    let message:string;
    let name:string;
    let sigle: string;
    let cancel:string;
    let save:string;
    this.translateService.get('STUDY.ADDCOURSE').subscribe((res:string) => {addcourse=res;});
    this.translateService.get('STUDY.MESSAGE').subscribe((res:string) => {message=res;});
    this.translateService.get('STUDY.NAME').subscribe((res:string) => {name=res;});
    this.translateService.get('STUDY.SIGLE').subscribe((res:string) => {sigle=res;});
    this.translateService.get('STUDY.CANCEL').subscribe((res:string) => {cancel=res;});
    this.translateService.get('STUDY.SAVE').subscribe((res:string) => {save=res;});
    let prompt = this.alertCtrl.create({
      title: addcourse,
      message: message,
      inputs: [
        {
          name: 'name',
          placeholder: name
        },
        {
          name: 'acronym',
          placeholder: sigle
        }
      ],
      buttons: [
        {
          text: cancel,
          handler: data => {
          }
        },
        {
          text: save,
          handler: data => {
            this.saveCourse(data.name, data.acronym);
          }
        }
      ]
    });
    prompt.present();
  }

  showPromptAddCourse(sigle : string) {
    let addcourse:string;
    let message:string;
    let name:string;
    let cancel:string;
    let save:string;
    this.translateService.get('STUDY.ADDCOURSE2').subscribe((res:string) => {addcourse=res;});
    this.translateService.get('STUDY.MESSAGE2').subscribe((res:string) => {message=res;});
    this.translateService.get('STUDY.NAME').subscribe((res:string) => {name=res;});
    this.translateService.get('STUDY.CANCEL').subscribe((res:string) => {cancel=res;});
    this.translateService.get('STUDY.SAVE').subscribe((res:string) => {save=res;});
    let prompt = this.alertCtrl.create({
      title: addcourse,
      message: message,
      inputs: [
        {
          name: 'name',
          placeholder: name
        }
      ],
      buttons: [
        {
          text: cancel,
          handler: data => {
          }
        },
        {
          text: save,
          handler: data => {
            this.saveCourse(data.name, sigle);
          }
        }
      ]
    });
    prompt.present();
  }

  getCourses(){
    this.storage.get('listCourses').then((data) =>
    {
      if(data==null){
        this.listCourses=[]
      } else {
        this.listCourses=data}
    });
  }

  saveCourse(name: string, tag: string){
    let course = new Course(name,tag, null);
    this.listCourses.push(course);
    this.storage.set('listCourses',this.listCourses);
  }

  removeCourse(course: Course){
    let index= this.listCourses.indexOf(course);
    if(index>= 0){
      this.listCourses.splice(index,1);
    }
    this.storage.set('listCourses',this.listCourses);
  }

  openCoursePage(course: Course){
    this.navCtrl.push(CoursePage,
      {course : course, sessionId : this.sessionId});
  }

  ionViewDidLoad() {

  }

  launch(url) {
    this.iab.create(url,'_system');
  }

  addCourseToCalendar(slidingItem : ItemSliding, course : Course){
    let options:any = {
    };
    for (let activity of course.activities) {
      this.calendar.createEventWithOptions(course.name +" : " + activity.type,
        activity.auditorium, null, activity.start,activity.end, options);
    }
    let message:string;
    this.translateService.get('STUDY.MESSAGE3').subscribe((res:string) => {message=res;});

    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
    slidingItem.close();
  }

}
