import { IonicModule } from '@ionic/angular';

import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { NewsPage } from './news';
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [NewsPage],
  imports: [
    IonicModule,
    TranslateModule.forChild(),
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class NewsPageModule {
}
