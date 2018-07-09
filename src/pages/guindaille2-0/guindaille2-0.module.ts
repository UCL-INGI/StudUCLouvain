import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';

import { GuindaillePage } from './guindaille2-0';

@NgModule({
  declarations: [GuindaillePage],
  imports: [
  	IonicPageModule.forChild(GuindaillePage),
  	TranslateModule.forChild()
  ]
})
export class GuindaillePageModule { }