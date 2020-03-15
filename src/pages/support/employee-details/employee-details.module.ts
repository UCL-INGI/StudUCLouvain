import { IonicModule } from '@ionic/angular';

import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { EmployeeDetailsPage } from './employee-details';
import { CommonModule } from "@angular/common";

@NgModule({
  declarations: [EmployeeDetailsPage],
  imports: [
    IonicModule,
    TranslateModule.forChild(),
    CommonModule
  ]
})
export class EmployeeDetailsPageModule {

}
