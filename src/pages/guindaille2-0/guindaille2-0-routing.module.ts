import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GuindaillePage } from './guindaille2-0';

const routes: Routes = [
    {path: '', component: GuindaillePage},
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class Guindaille20RoutingModule {
}
