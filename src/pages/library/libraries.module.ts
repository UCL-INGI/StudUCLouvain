import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';

import { LibrariesPage } from './libraries';

@NgModule({
  declarations: [LibrariesPage],
  imports: [
  	IonicPageModule.forChild(LibrariesPage),
  	TranslateModule.forChild()
  ]
})
export class LibrariesPageModule { }