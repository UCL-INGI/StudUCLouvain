import {IonicPageModule} from 'ionic-angular';

import {NgModule} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';

import {EmployeeDetailsPage} from './employee-details';

@NgModule({
  declarations: [EmployeeDetailsPage],
  imports: [
    IonicPageModule.forChild(EmployeeDetailsPage),
    TranslateModule.forChild()
  ]
})
export class EmployeeDetailsPageModule {
}
