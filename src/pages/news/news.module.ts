import { IonicModule } from '@ionic/angular';

import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { NewsPage } from './news';

@NgModule({
  declarations: [NewsPage],
  imports: [IonicModule, TranslateModule.forChild()]
})
export class NewsPageModule {
}
