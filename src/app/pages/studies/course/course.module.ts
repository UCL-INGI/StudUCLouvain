import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { CoursePage } from './course';

@NgModule({
  declarations: [CoursePage],
  imports: [
  	IonicModule,
  	TranslateModule.forChild()
  ]
})
export class CoursePageModule { }