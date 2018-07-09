import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';

import { CarpoolingPage } from './carpooling';

@NgModule({
  declarations: [CarpoolingPage],
  imports: [
  	IonicPageModule.forChild(CarpoolingPage),
  	TranslateModule.forChild()
  ]
})
export class CarpoolingPageModule { }