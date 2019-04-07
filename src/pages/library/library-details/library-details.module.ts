import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';

import { LibraryDetailsPage } from './library-details';

@NgModule({
  declarations: [LibraryDetailsPage],
  imports: [
  	IonicPageModule.forChild(LibraryDetailsPage),
  	TranslateModule.forChild()
  ]
})
export class LibraryDetailsPageModule { }