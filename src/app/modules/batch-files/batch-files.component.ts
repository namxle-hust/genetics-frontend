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
import { BatchService } from 'src/app/core/services';
import { CreateBatchFilesComponent } from './create-batch-files/create-batch-files.component';
import { ConfirmModalComponent } from 'src/app/shared/partials/confirm-modal/confirm-modal.component';

@Component({
    selector: 'app-batch-files',
    templateUrl: './batch-files.component.html',
    styleUrls: ['./batch-files.component.scss']
})
export class BatchFilesComponent implements
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
    ISearchView,
    IFilterView {

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
        public batchService: BatchService,
        private toastr: ToastrService
    ) { }

    ngOnInit(): void {
        this.filterForm();
        this.searchForm();
        this.batchService.fetch();
        this.grouping = this.batchService.grouping;
        this.paginator = this.batchService.paginator;
        this.sorting = this.batchService.sorting;
        const sb = this.batchService.isLoading$.subscribe(res => this.isLoading = res);
        this.subscriptions.push(sb);

        const sbErrorMessage = this.batchService.errorMessage$.subscribe((value) => {
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
        // this.batchService.patchState({ filter });
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
        this.batchService.patchState({ searchTerm });
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
        this.batchService.patchState({ sorting });
    }

    // pagination
    paginate(paginator: PaginatorState) {
        this.batchService.patchState({ paginator });
    }


    create() {
        this.edit();
    }

    edit(id?: number) {
        const modalRef = this.modalService.open(CreateBatchFilesComponent, { size: 'lg' });
        modalRef.componentInstance.id = id;
        modalRef.result.then(() =>
            this.batchService.fetch(),
            () => { this.batchService.fetch() },
        );
    }

    deleteSelected() {
        this.deleteModal = this.modalService.open(ConfirmModalComponent, { size: 'md' });

        this.deleteModal.componentInstance.confirmButtonTitle = 'Delete';
        this.deleteModal.componentInstance.modalTitle = 'Delete Batch Files';
        this.deleteModal.componentInstance.confirmQuestion = 'Are you sure to delete this batch files';
        this.deleteModal.componentInstance.executingMessage = 'Deleting...';
        
        const sbIsSubmit = this.deleteModal.componentInstance.isDelete$.subscribe((value: boolean) => {
            if (value) {
                console.log("Deleting")
                // this.deleteModal.close();
                this.deleteModal.componentInstance.isLoadingSubject.next(true);
                const sb = this.batchService.deleteItems(this.grouping.getSelectedRows()).subscribe((value) => {
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
            this.batchService.fetch(),
            () => { 
                this.batchService.fetch()
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

