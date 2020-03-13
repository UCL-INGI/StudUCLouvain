import { IonicModule } from '@ionic/angular';

import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { NewsDetailsPage } from './news-details';
import { CommonModule } from "@angular/common";

@NgModule({
  declarations: [NewsDetailsPage],
  imports: [
    IonicModule,
    TranslateModule.forChild(),
    CommonModule
  ]
})
export class NewsDetailsPageModule {
}
