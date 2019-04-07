import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';

import { CreditPage } from './credit';

@NgModule({
  declarations: [CreditPage],
  imports: [
  	IonicPageModule.forChild(CreditPage),
  	TranslateModule.forChild()
  ]
})
export class CreditPageModule { }