import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';

import { CoursePage } from './course';

@NgModule({
  declarations: [CoursePage],
  imports: [
  	IonicPageModule.forChild(CoursePage),
  	TranslateModule.forChild()
  ]
})
export class CoursePageModule { }