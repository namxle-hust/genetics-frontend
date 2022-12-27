import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BatchFilesComponent } from './batch-files.component';


export const routes: Routes = [
    {
        path: '',
        component: BatchFilesComponent
    },
    { path: '**', redirectTo: 'error/404' },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class BatchFilesRoutingModule { }
