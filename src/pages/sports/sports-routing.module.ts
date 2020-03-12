import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SportsPage } from './sports';

const routes: Routes = [
    {path: '', component: SportsPage},
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class SportsRoutingModule {
}
