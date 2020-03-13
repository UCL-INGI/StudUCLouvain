import { IonicModule } from '@ionic/angular';

import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { StudiesPage } from './studies';
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

@NgModule({
  declarations: [StudiesPage],
  imports: [
    IonicModule,
    TranslateModule.forChild(),
    CommonModule,
    FormsModule
  ]
})
export class StudiesPageModule {
}
