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
  public error:string = "";
  private status: string = "";
  sigles: any;
  activities:any = [];
  response:any;
  language;
  private statusInsc:string = "";
  private prog:string = "";

  constructor(
    public studiesService: StudiesService,
    public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController,
    public storage:Storage,
    public menu: MenuController,
    public toastCtrl: ToastController,
    public platform: Platform,
    private iab: InAppBrowser,
    public modalCtrl: ModalController,
    public connService : ConnectivityService,
    private translateService: TranslateService,
    private wso2Service: Wso2Service,
    private studentService: StudentService)
  {
    this.title = this.navParams.get('title');

    this.initializeSession();
    this.menu.enable(true, "studiesMenu");
    this.getCourses();


  }

  checkExist(sigle:string) : Promise<any>{
    let response:any;
    let year = parseInt(this.project.name.split("-")[0]);
    return new Promise(resolve => {
      this.studentService.checkCourse(sigle,year).then(
      (data) =>{
        let res:any = data;
        let exist:boolean;
        let nameFR:string='';
        let nameEN:string ='';
        if(data === 400) exist=false;
        else{
          console.log(res);
          let names = res.intituleCompletMap.entry;
          nameFR = names[1].value;
          nameEN = names[0].value;
          exist=true;
        }
        response={'exist':exist,'nameFR':nameFR, 'nameEN':nameEN};
        resolve(response);
      })
      })    
  }

  toastBadCourse() {
    let msg;
    this.translateService.get('STUDY.BADCOURSE').subscribe((res:string) => {msg=res;});
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'middle'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

 /*Authenticate a student*/
  private login(){
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
            resolve(data);
          }
        });
    });
  }

  /*Get course program of student*/
  loadActivities(){

    if(this.connService.isOnline()) {
      this.login().then((res) => {
  	  	if(this.status){
  	  		this.studentService.searchActivities().then((res) => {
  	  			let result:any = res;
  	  			this.sigles = result.activities.activity;
            for(let sigle of this.sigles){
              //let name;
              //this.checkExist(sigle).then(data => {
                //name=data;
                //this.activities.push({'name':name.nameFR,'sigle':sigle});
              //})
              this.activities.push({'name':'', 'sigle':sigle});
            }
  	  		})
          .catch((err) => {
            console.log("Error during load of course program");
          });

          this.studentService.getStatus().then((res) => {
            let result:any = res;
            this.statusInsc = result[0].etatInscription;
            this.prog = result[0].intitOffreComplet;
          })
          .catch((err) => {
            console.log("Error during load of inscription status");
          })
  	  	}
        
    	});
    }
    else{
      this.navCtrl.pop();
      this.connService.presentConnectionAlert();
    }
  }

  /*Open modalprojectpage to choose an ade project*/
  openModalProject(){
    let obj = {sessionId : this.sessionId};

    let myModal = this.modalCtrl.create('ModalProjectPage', obj);
    myModal.onDidDismiss(data => {
      this.project = data;

    });
    myModal.present();
  }

  /*Set project and connect to ADE*/
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
      this.navCtrl.pop();
      this.connService.presentConnectionAlert();
    }
  }

  /*Add a course manually, show a prompt to the user for this where he can put the name and the acronym of the course*/
  showPrompt() {
    let addcourse:string;
    let message:string;
    let sigle: string;
    let cancel:string;
    let save:string;
    this.translateService.get('STUDY.ADDCOURSE').subscribe((res:string) => {addcourse=res;});
    this.translateService.get('STUDY.MESSAGE').subscribe((res:string) => {message=res;});
    this.translateService.get('STUDY.SIGLE').subscribe((res:string) => {sigle=res;});
    this.translateService.get('STUDY.CANCEL').subscribe((res:string) => {cancel=res;});
    this.translateService.get('STUDY.SAVE').subscribe((res:string) => {save=res;});
    let prompt = this.alertCtrl.create({
      title: addcourse,
      message: message,
      inputs: [
        {
          name: 'acronym',
          placeholder: sigle
        }/*,
        {
          name:'name',
          placeholder:'Nom du cours'
        }*/
      ],
      buttons: [
        {
          text: cancel,
          handler: data => {
          }
        },
        {
          text: save,
          cssClass: 'save',
          handler: data => {
            let check; 
            //console.log(data);
            let acro = data.acronym.toUpperCase();
            //console.log(acro);
            let already = false;
            for(let item of this.listCourses){
              if(item.acronym === acro) already = true;
            }
            if(!already){
              this.checkExist(acro).then(data2 => {
                check = data2;
                if(check.exist){
                  this.addCourse(acro, check.nameFR);
                  //this.addCourse(acro,data.name);
                }
                else{
                  this.toastBadCourse();
                  this.showPrompt();
                }
              })
            }
            else{
              this.toastAlreadyCourse();
            }
          }
        }
      ]
    });
    prompt.present();
  }

  toastAlreadyCourse() {
    let msg;
    this.translateService.get('STUDY.ALCOURSE').subscribe((res:string) => {msg=res;});
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'middle'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }


  /*Add a course from course program, a prompt is shown for this and the user can add a name*/
  /*showPromptAddCourse(sigle : string) {
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
      cssClass: "alert",
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
            console.log(data);
            //this.getNameToAddCourse(data)
            //let check;

            this.addCourse(sigle, data.name);
          }
        }
      ]
    });
    prompt.present();
  }*/

  addCourseFromProgram(acro:string){
                let check; 
            //console.log(data);
            //console.log(acro);
            let already = false;
            for(let item of this.listCourses){
              if(item.acronym === acro) already = true;
            }
            if(!already){
              this.checkExist(acro).then(data2 => {
                check = data2;
                if(check.exist){
                  this.addCourse(acro, check.nameFR);
                  //this.addCourse(acro,data.name);
                }
                else{
                  this.toastBadCourse();
                  this.showPrompt();
                }
              })
            }
            else{
              this.toastAlreadyCourse();
            }
  }

  addCourse(sigle:string, name:string){
    //console.log(sigle);
   // let check; 
    //this.checkExist(sigle).then(data => {
      //check = data;
      console.log(this.listCourses);
      this.saveCourse(name, sigle);
      let toast = this.toastCtrl.create({
        message: 'Cours ajouté',
        duration: 1000,
        position: 'bottom'
      });

      toast.present();
   // })
  }

  /*Retrieve list of course added previously in the storage*/
  getCourses(){
    this.storage.get('listCourses').then((data) =>
    {
      if(data==null){
        this.listCourses=[]
      } else {
        this.listCourses=data}
    });
  }

  /*Save course into storage*/
  saveCourse(name: string, tag: string){
    let course = new Course(name,tag, null);
    this.listCourses.push(course);
    this.storage.set('listCourses',this.listCourses);
  }

  /*Remove course from storage*/
  removeCourse(course: Course){
    let index= this.listCourses.indexOf(course);
    if(index>= 0){
      this.listCourses.splice(index,1);
    }
    this.storage.set('listCourses',this.listCourses);
  }

  /*Open CoursePage of a course to have the schedule*/
  openCoursePage(course: Course){
    let year = parseInt(this.project.name.split("-")[0]);
    this.navCtrl.push('CoursePage',
      {course : course, sessionId : this.sessionId, year: year});
  }

  openWeekPage(){
    this.studentService.weekSchedule().then((res) => {
      let result:any = res;
      console.log(result);
      
      //result.sort((a, b) => parseInt(a.date.substr(0,2)) - parseInt(b.date.substr(0,2)));
      this.navCtrl.push('HebdoPage', {schedule:result});
    });
  }

  unavailableAlert(){

    let alert = this.alertCtrl.create({
      title: 'Indisponible',
      subTitle: 'Cette fonctionnalité n\'est pas encore disponible',
      buttons: ['OK']
    });
    alert.present();

  }

  openExamPage(){
    this.unavailableAlert();
      //this.navCtrl.push('ExamPage');
  }

  /*Launch moodle or ucl portal*/
  launch(url) {
    this.iab.create(url,'_system');
  }
}
