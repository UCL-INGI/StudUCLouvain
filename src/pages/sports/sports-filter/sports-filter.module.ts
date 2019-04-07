import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';

import { SportsFilterPage } from './sports-filter';

@NgModule({
  declarations: [SportsFilterPage],
  imports: [
  	IonicPageModule.forChild(SportsFilterPage),
  	TranslateModule.forChild()
  ]
})
export class SportsFilterPageModule { }