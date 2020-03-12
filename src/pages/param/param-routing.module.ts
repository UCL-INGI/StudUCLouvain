import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ParamPage } from './param';

const routes: Routes = [
    {path: '', component: ParamPage},
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class SettingsRoutingModule {
}
