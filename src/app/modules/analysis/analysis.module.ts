import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalysisComponent } from './analysis.component';
import { AnalysisRoutingModule } from './analysis-routing.module';
import { CreateAnalysisComponent } from './create-analysis/create-analysis.component';
import { AnalysisStatusConverterPipe, VcfTypeConverterPipe } from 'src/app/core/pipes';
import { CRUDTableModule } from 'src/app/shared/crud-table';
import { NgSelect2Module } from 'ng-select2';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { AnalysisService, WorkspaceService } from 'src/app/core/services';
import { VariantsComponent } from './variants/variants.component';
import { AnalysisQcComponent } from './analysis-qc/analysis-qc.component';
import { AnalysisDetailComponent } from './analysis-detail/analysis-detail.component';
import { VariantFilterComponent } from './variants/variant-filter/variant-filter.component';
import { VariantListComponent } from './variants/variant-list/variant-list.component';
import { SafeUrlPipe } from 'src/app/core/pipes';



@NgModule({
    declarations: [
        AnalysisComponent,
        CreateAnalysisComponent,
        VcfTypeConverterPipe,
        AnalysisStatusConverterPipe,
        VariantsComponent,
        AnalysisQcComponent,
        AnalysisDetailComponent,
        VariantFilterComponent,
        VariantListComponent,
        SafeUrlPipe
    ],
    imports: [
        CommonModule,
        AnalysisRoutingModule,
        CRUDTableModule,
        NgSelect2Module,
        FormsModule,
        ReactiveFormsModule,
        NgbDatepickerModule,
        CommonModule,
        InlineSVGModule,
        NgbModalModule
    ],
    providers: [AnalysisService]
})
export class AnalysisModule { }