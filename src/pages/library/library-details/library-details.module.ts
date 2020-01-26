import { IonicPageModule } from 'ionic-angular';

import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { LibraryDetailsPage } from './library-details';

@NgModule({
  declarations: [LibraryDetailsPage],
  imports: [
    IonicPageModule.forChild(LibraryDetailsPage),
    TranslateModule.forChild()
  ]
})
export class LibraryDetailsPageModule {}
