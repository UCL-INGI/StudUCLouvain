import { IonicModule } from '@ionic/angular';

import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { LibrariesPage } from './libraries';
import { CommonModule } from "@angular/common";

@NgModule({
  declarations: [LibrariesPage],
  imports: [
    IonicModule,
    TranslateModule.forChild(),
    CommonModule
  ]
})
export class LibrariesPageModule {
}
