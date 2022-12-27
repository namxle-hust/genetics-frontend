import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkspacesComponent } from './workspaces.component';

export const routes: Routes = [
    {
        path: '',
        component: WorkspacesComponent
    },
    { path: '**', redirectTo: 'error/404' },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class WorkspaceRoutingModule { }
