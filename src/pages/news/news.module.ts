import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';

import { NewsPage } from './news';

@NgModule({
  declarations: [NewsPage],
  imports: [
  	IonicPageModule.forChild(NewsPage),
  	TranslateModule.forChild()
  ]
})
export class NewsPageModule { }