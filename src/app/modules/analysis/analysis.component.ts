
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
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
import { AnalysisService } from 'src/app/core/services';
import { CreateAnalysisComponent } from './create-analysis/create-analysis.component';
import { ConfirmModalComponent } from 'src/app/shared/partials/confirm-modal/confirm-modal.component';


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

    paginator: PaginatorState;
    sorting: SortState;
    grouping: GroupingState;
    isLoading: boolean;
    filterGroup: FormGroup;
    searchGroup: FormGroup;
    private subscriptions: Subscription[] = [];

    private deleteModal: NgbModalRef;

    constructor(
        private fb: FormBuilder,
        private modalService: NgbModal,
        public analysisService: AnalysisService,
        private toastr: ToastrService
    ) { }

    ngOnInit(): void {
        this.filterForm();
        this.searchForm();
        this.analysisService.fetch();
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
        // this.filterGroup = this.fb.group({
        //     status: [''],
        //     searchTerm: [''],
        // });
        // this.subscriptions.push(
        //     this.filterGroup.controls.status.valueChanges.subscribe(() =>
        //         this.filter()
        //     )
        // );
    }

    filter() {
        // const filter = {};
        // const status = this.filterGroup.get('status').value;
        // if (status) {
        //     filter['status'] = status;
        // }
        // this.analysisService.patchState({ filter });
    }

    searchForm() {
        this.searchGroup = this.fb.group({
            searchTerm: [''],
        });
        const searchEvent = this.searchGroup.controls.searchTerm.valueChanges
            .pipe(
                debounceTime(150),
                distinctUntilChanged()
            )
            .subscribe((val) => this.search(val));
        this.subscriptions.push(searchEvent);
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
        this.subscriptions.forEach((sb) => sb.unsubscribe());
    }
}


