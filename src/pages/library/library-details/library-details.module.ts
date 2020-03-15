import { IonicModule } from '@ionic/angular';

import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { LibraryDetailsPage } from './library-details';
import { CommonModule } from "@angular/common";

@NgModule({
  declarations: [LibraryDetailsPage],
  imports: [
    IonicModule,
    TranslateModule.forChild(),
    CommonModule
  ]
})
export class LibraryDetailsPageModule {
}
