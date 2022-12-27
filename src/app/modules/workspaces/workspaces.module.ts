import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspacesComponent } from './workspaces.component';
import { CRUDTableModule } from 'src/app/shared/crud-table';
import { NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelect2Module } from 'ng-select2';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { WorkspaceRoutingModule } from './workspace-routing.module';
import { WorkspaceService } from 'src/app/core/services';
import { EditWorkspaceComponent } from './edit-workspace/edit-workspace.component';
import { DeleteWorkspaceComponent } from './delete-workspace/delete-workspace.component';



@NgModule({
    declarations: [
        WorkspacesComponent,
        EditWorkspaceComponent,
        DeleteWorkspaceComponent
    ],
    imports: [
        WorkspaceRoutingModule,
        CRUDTableModule,
        NgSelect2Module,
        FormsModule,
        ReactiveFormsModule,
        NgbModalModule,
        NgbDatepickerModule,
        CommonModule,
        InlineSVGModule,
        NgbModalModule
    ],
    providers: [WorkspaceService]
})
export class WorkspacesModule { }
