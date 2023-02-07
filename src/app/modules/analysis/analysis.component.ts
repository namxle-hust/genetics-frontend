
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import {
    GroupingState,
    PaginatorState,
    SortState,
    ICreateAction,
    IEditAction,
    IDeleteAction,
    IDeleteSelectedAction,
    IFetchSelectedAction,
    IUpdateStatusForSelectedAction,
    ISortView,
    IFilterView,
    IGroupingView,
    ISearchView
} from 'src/app/shared/crud-table'
import { AnalysisService, CommonService, SampleService, WorkspaceService } from 'src/app/core/services';
import { CreateAnalysisComponent } from './create-analysis/create-analysis.component';
import { ConfirmModalComponent } from 'src/app/shared/partials/confirm-modal/confirm-modal.component';
import { ANALYSIS_STATUSES, ANALYSIS_STATUS_FILTER, DEBOUNCE_TIME, VCF_TYPES } from 'src/app/core/constants';
import { ActivatedRoute, Params } from '@angular/router';
import { AnalysisStatusEnum, VcfTypeEnum } from 'src/app/core/config';
import { SampleModel, WorkspaceModel } from 'src/app/core/models';
import { Select2OptionData } from 'ng-select2';


interface IFilter {
    status?: AnalysisStatusEnum[]
    vcfType?: VcfTypeEnum,
    workspaceId?: number,
    sampleId?: number
}

@Component({
    selector: 'app-analyses',
    templateUrl: './analysis.component.html',
    styleUrls: ['./analysis.component.scss']
})
export class AnalysisComponent implements
    OnInit,
    OnDestroy,
    ICreateAction,
    IEditAction,
    IDeleteAction,
    IDeleteSelectedAction,
    IFetchSelectedAction,
    IUpdateStatusForSelectedAction,
    ISortView,
    IFilterView,
    IGroupingView,
    ISearchView {

    public options = {
        width: '100%',
        multiple: true,
        tags: true
    };

    paginator: PaginatorState;
    sorting: SortState;
    grouping: GroupingState;
    isLoading: boolean;
    filterGroup: FormGroup;
    searchGroup: FormGroup;
    private subscriptions: Subscription[] = [];

    private deleteModal: NgbModalRef;

    workspaces$: Observable<WorkspaceModel[]>
    samples$: Observable<SampleModel[]>

    analisysStatusesFilter = ANALYSIS_STATUS_FILTER

    vcfTypes = VCF_TYPES

    sampleList: Select2OptionData[] = []

    constructor(
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private modalService: NgbModal,
        public analysisService: AnalysisService,
        private toastr: ToastrService,
        private commonService: CommonService,
        private sampleService: SampleService,
        // private cd: ChangeDetectorRef,
        private workspaceService: WorkspaceService
    ) {

    }

    patchParams(params: Params) {
        if (params.sampleId) {
            this.filterGroup.controls['sampleId'].setValue([params.sampleId]);
            this.filter();
        }
    }

    ngOnInit(): void {
        this.loadWorkspace()
        this.loadSamples()

        this.route.queryParams.subscribe(params => {
            this.filterForm();
            if (Object.keys(params).length === 0) {
                this.analysisService.fetch();
            } else {
                this.patchParams(params)
            }
        })


        this.grouping = this.analysisService.grouping;
        this.paginator = this.analysisService.paginator;
        this.sorting = this.analysisService.sorting;
        const sb = this.analysisService.isLoading$.subscribe(res => this.isLoading = res);
        this.subscriptions.push(sb);

        const sbErrorMessage = this.analysisService.errorMessage$.subscribe((value) => {
            if (value) {
                this.toastr.error(value);
            }
        })
        this.subscriptions.push(sbErrorMessage);
    }

    filterForm() {
        this.filterGroup = this.fb.group({
            status: [''],
            searchTerm: [''],
            workspaceId: [''],
            type: [''],
            sampleId: ['']
        });

        const statusEvent = this.filterGroup.controls.status.valueChanges.subscribe(() =>
            this.filter()
        )
        this.subscriptions.push(statusEvent)

        const typeEvent = this.filterGroup.controls.type.valueChanges.subscribe(() =>
            this.filter()
        )
        this.subscriptions.push(typeEvent)

        const workspaceEvent = this.filterGroup.controls.workspaceId.valueChanges.subscribe(() => {
            this.filter()
        })
        this.subscriptions.push(workspaceEvent)

        const sampleEvent = this.filterGroup.controls.sampleId.valueChanges.subscribe(() => {
            this.filter()
        })
        this.subscriptions.push(sampleEvent)

        const searchEvent = this.filterGroup.controls.searchTerm.valueChanges
            .pipe(
                debounceTime(DEBOUNCE_TIME),
                distinctUntilChanged()
            )
            .subscribe((val) => this.search(val));
        this.subscriptions.push(searchEvent);
    }

    filter() {
        const filter: IFilter = {};
        const status = this.filterGroup.get('status')?.value?.split(',')?.filter((s: any) => s);
        if (status && status.length > 0) {
            filter['status'] = status;
        }

        const vcfType = this.filterGroup.get('type')?.value;
        if (vcfType) {
            filter['vcfType'] = vcfType;
        }

        const workspaceId = this.filterGroup.get('workspaceId')?.value;
        if (workspaceId) {
            filter['workspaceId'] = parseInt(workspaceId);
        }

        const sampleIds = this.filterGroup.get('sampleId')?.value;
        if (sampleIds && sampleIds.length > 0) {
            filter['sampleId'] = sampleIds.map((sampleId: string) => parseInt(sampleId));
        }

        this.analysisService.patchState({ filter });
    }

    searchForm() {

    }

    search(searchTerm: string) {
        this.analysisService.patchState({ searchTerm });
    }

    // sorting
    sort(column: string) {
        const sorting = this.sorting;
        const isActiveColumn = sorting.column === column;
        if (!isActiveColumn) {
            sorting.column = column;
            sorting.direction = 'asc';
        } else {
            sorting.direction = sorting.direction === 'asc' ? 'desc' : 'asc';
        }
        this.analysisService.patchState({ sorting });
    }

    // pagination
    paginate(paginator: PaginatorState) {
        this.analysisService.patchState({ paginator });
    }


    create() {
        this.edit();
    }

    edit(id?: number) {
        const modalRef = this.modalService.open(CreateAnalysisComponent, { size: 'lg' });
        modalRef.componentInstance.id = id;
        modalRef.result.then(() =>
            this.analysisService.fetch(),
            () => { this.analysisService.fetch() },
        );
    }

    loadWorkspace() {
        this.workspaces$ = this.workspaceService.getWorkspaces()
    }

    loadSamples() {
        this.samples$ = this.sampleService.getSamples()
    }

    deleteSelected() {
        this.deleteModal = this.modalService.open(ConfirmModalComponent, { size: 'md' });

        this.deleteModal.componentInstance.confirmButtonTitle = 'Delete';
        this.deleteModal.componentInstance.modalTitle = 'Delete Analyses';
        this.deleteModal.componentInstance.confirmQuestion = 'Are you sure to delete this analyses';
        this.deleteModal.componentInstance.executingMessage = 'Deleting...';

        const sbIsSubmit = this.deleteModal.componentInstance.isDelete$.subscribe((value: boolean) => {
            if (value) {
                console.log("Deleting")
                // this.deleteModal.close();
                this.deleteModal.componentInstance.isLoadingSubject.next(true);
                const sb = this.analysisService.deleteItems(this.grouping.getSelectedRows()).subscribe((value) => {
                    if (value) {
                        this.deleteModal.close();
                    }
                })
                this.subscriptions.push(sb);
            }
        })

        this.deleteModal.closed.subscribe(() => {
            sbIsSubmit.unsubscribe();
        })

        this.deleteModal.result.then(() =>
            this.analysisService.fetch(),
            () => {
                this.analysisService.fetch()
            }
        );
    }


    delete(id: number) {

    }

    fetchSelected() {

    }

    updateStatusForSelected() {

    }

    ngOnDestroy() {
        this.analysisService.patchStateReset()
        this.subscriptions.forEach((sb) => sb.unsubscribe());
    }
}


