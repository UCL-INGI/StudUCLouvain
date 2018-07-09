import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';

import { BusPage } from './bus';

@NgModule({
  declarations: [BusPage],
  imports: [
  	IonicPageModule.forChild(BusPage),
  	TranslateModule.forChild()
  ]
})
export class BusPageModule { }