import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AnanlysisGuard } from 'src/app/core/guards';
import { AnalysisDetailComponent } from './analysis-detail/analysis-detail.component';
import { AnalysisComponent } from './analysis.component';


export const routes: Routes = [
    {
        path: '',
        component: AnalysisComponent
    },
    {
        path: ':id/detail',
        canActivate: [AnanlysisGuard],
        component: AnalysisDetailComponent
        
    },
    { path: '**', redirectTo: 'error/404' },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AnalysisRoutingModule { }
