import { IonicModule } from '@ionic/angular';

import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { LibrariesPage } from './libraries';

@NgModule({
  declarations: [LibrariesPage],
  imports: [IonicModule, TranslateModule.forChild()]
})
export class LibrariesPageModule {
}
