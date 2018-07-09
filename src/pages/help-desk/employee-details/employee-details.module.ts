import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';

import { EmployeeDetailsPage } from './employee-details';

@NgModule({
  declarations: [EmployeeDetailsPage],
  imports: [
  	IonicPageModule.forChild(EmployeeDetailsPage),
  	TranslateModule.forChild()
  ]
})
export class EmployeeDetailsPageModule { }