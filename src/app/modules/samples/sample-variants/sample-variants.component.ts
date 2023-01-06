import { Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';
import { IVariantFilter } from 'src/app/core/models';
import { VariantService } from 'src/app/core/services';
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

@Component({
    selector: 'app-sample-variants',
    templateUrl: './sample-variants.component.html',
    styleUrls: ['./sample-variants.component.scss'],
    providers: [VariantService]
})
export class SampleVariantsComponent implements
    OnInit,
    OnDestroy,
    ICreateAction,
    IEditAction,
    IFetchSelectedAction,
    IUpdateStatusForSelectedAction,
    ISortView,
    IFilterView,
    IGroupingView,
    ISearchView {

    @ViewChild('filterWrapper') filterWrapperEl: ElementRef;

    asideState: boolean = true;

    paginator: PaginatorState;
    sorting: SortState;
    grouping: GroupingState;
    isLoading: boolean;
    filterGroup: FormGroup;
    searchGroup: FormGroup;

    private sampleId: number;

    private subscriptions: Subscription[] = []

    constructor(
        private fb: FormBuilder,
        public variantService: VariantService,
        private toastr: ToastrService,
        private route: ActivatedRoute,
        private renderer: Renderer2
    ) {
        this.sampleId = this.route.snapshot.params["id"];
        this.variantService.sampleId = this.sampleId
    }

    ngOnInit(): void {
        console.log(this.sampleId)
        this.filterForm();
        this.searchForm();
        this.variantService.fetch();
        this.grouping = this.variantService.grouping;
        this.paginator = this.variantService.paginator;
        this.sorting = this.variantService.sorting;
        const sb = this.variantService.isLoading$.subscribe(res => this.isLoading = res);
        this.subscriptions.push(sb);

        const sbErrorMessage = this.variantService.errorMessage$.subscribe((value) => {
            if (value) {
                this.toastr.error(value);
            }
        })
        this.subscriptions.push(sbErrorMessage);
    }

    toggleAside() {
        if (this.asideState) {
            this.asideState = false
        } else {
            this.asideState = true
        }
    }



    edit(id: number): void {
    }
    fetchSelected(): void {
    }
    updateStatusForSelected(): void {
    }

    sort(column: string): void {
        const sorting = this.sorting;
        const isActiveColumn = sorting.column === column;
        if (!isActiveColumn) {
            sorting.column = column;
            sorting.direction = 'asc';
        } else {
            sorting.direction = sorting.direction === 'asc' ? 'desc' : 'asc';
        }
        this.variantService.patchState({ sorting });
    }
    filterForm(): void {

    }

    applyFilter(filter: IVariantFilter): void {
        console.log(filter)
        this.variantService.patchState({ filter })
    }
    
    filter(): void {

    }
    searchForm(): void {
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
    search(searchTerm: string): void {
        this.variantService.patchState({ searchTerm });
    }
    create(): void {

    }

    // pagination
    paginate(paginator: PaginatorState) {
        this.variantService.patchState({ paginator });
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(sb => sb.unsubscribe())
    }

}
