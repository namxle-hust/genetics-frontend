import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BatchFilesComponent } from './batch-files.component';
import { BatchFilesRoutingModule } from './batch-files-routing.module';
import { CRUDTableModule } from 'src/app/shared/crud-table';
import { NgSelect2Module } from 'ng-select2';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { BatchService } from 'src/app/core/services';
import { CreateBatchFilesComponent } from './create-batch-files/create-batch-files.component';
import { FormatBytesPipe, SampleTypeConverterPipe, UploadFileileStatusConverterPipe } from 'src/app/core/pipes';
import { UploadComponent } from 'src/app/shared/partials/upload/upload.component';
import { ConfirmModalComponent } from 'src/app/shared/partials/confirm-modal/confirm-modal.component';



@NgModule({
    declarations: [
        BatchFilesComponent,
        CreateBatchFilesComponent,
        SampleTypeConverterPipe,
        FormatBytesPipe,
        UploadComponent,
        UploadFileileStatusConverterPipe,
        ConfirmModalComponent
    ],
    imports: [
        BatchFilesRoutingModule,
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
    providers: [BatchService]
})
export class BatchFileModule { }
