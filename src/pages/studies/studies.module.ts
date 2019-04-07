import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';

import { StudiesPage } from './studies';

@NgModule({
  declarations: [StudiesPage],
  imports: [
  	IonicPageModule.forChild(StudiesPage),
  	TranslateModule.forChild()
  ]
})
export class StudiesPageModule { }