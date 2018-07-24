import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';

import { NewsDetailsPage } from './news-details';

@NgModule({
  declarations: [NewsDetailsPage],
  imports: [
  	IonicPageModule.forChild(NewsDetailsPage),
  	TranslateModule.forChild()
  ]
})
export class NewsDetailsPageModule { }