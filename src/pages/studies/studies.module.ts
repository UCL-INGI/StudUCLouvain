import { IonicModule } from '@ionic/angular';

import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { StudiesPage } from './studies';

@NgModule({
  declarations: [StudiesPage],
  imports: [IonicModule, TranslateModule.forChild()]
})
export class StudiesPageModule {
}
