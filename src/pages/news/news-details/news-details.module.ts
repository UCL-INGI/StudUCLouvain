import { IonicModule } from '@ionic/angular';

import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { NewsDetailsPage } from './news-details';

@NgModule({
  declarations: [NewsDetailsPage],
  imports: [
    IonicModule,
    TranslateModule.forChild()
  ]
})
export class NewsDetailsPageModule {
}
