import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
import { WorkspaceService } from 'src/app/core/services';
import { EditWorkspaceComponent } from './edit-workspace/edit-workspace.component';

@Component({
    selector: 'app-workspaces',
    templateUrl: './workspaces.component.html',
    styleUrls: ['./workspaces.component.scss']
})
export class WorkspacesComponent implements
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

    constructor(
        private fb: FormBuilder,
        private modalService: NgbModal,
        public workspacesService: WorkspaceService,
        private toastr: ToastrService
        ) { }

    ngOnInit(): void {
        this.filterForm();
        this.searchForm();
        this.workspacesService.fetch();
        this.grouping = this.workspacesService.grouping;
        this.paginator = this.workspacesService.paginator;
        this.sorting = this.workspacesService.sorting;
        const sb = this.workspacesService.isLoading$.subscribe(res => this.isLoading = res);
        this.subscriptions.push(sb);

        const sbErrorMessage = this.workspacesService.errorMessage$.subscribe((value) => {
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
        // this.workspacesService.patchState({ filter });
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
        this.workspacesService.patchState({ searchTerm });
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
        this.workspacesService.patchState({ sorting });
    }

    // pagination
    paginate(paginator: PaginatorState) {
        this.workspacesService.patchState({ paginator });
    }


    create() {
        this.edit();
    }

    edit(id?: number) {
        const modalRef = this.modalService.open(EditWorkspaceComponent, { size: 'md' });
        modalRef.componentInstance.id = id;
        modalRef.result.then(() =>
            this.workspacesService.fetch(),
            () => { this.workspacesService.fetch() }
        );
    }

    delete(id: number) {
        // const modalRef = this.modalService.open(DeleteWorkspaceModalComponent, { size: 'md' });
        // modalRef.componentInstance.id = id;
        // modalRef.result.then(() =>
        //     this.workspacesService.fetch(),
        //     () => { }
        // );
    }

    shareWorkspace() {
        // const modalRef = this.modalService.open(ShareWorkspaceModalComponent, { size: 'md' });
        // modalRef.componentInstance.ids = this.grouping.getSelectedRows();
        // modalRef.result.then(() =>
        //     this.workspacesService.fetch(),
        //     () => { }
        // )
    }

    deleteSelected() {

    }

    fetchSelected() {

    }

    updateStatusForSelected() {

    }

    ngOnDestroy() {
        this.subscriptions.forEach((sb) => sb.unsubscribe());
    }
}
