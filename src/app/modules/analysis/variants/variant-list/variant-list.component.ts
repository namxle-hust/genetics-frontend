import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { VariantModel } from 'src/app/core/models';
import { VariantService } from 'src/app/core/services';
import { GroupingState, SortState } from 'src/app/shared/crud-table';

@Component({
    selector: 'app-variant-list',
    templateUrl: './variant-list.component.html',
    styleUrls: ['./variant-list.component.scss']
})
export class VariantListComponent implements OnInit, OnDestroy {

    @Input() sorting: SortState
    @Input() grouping: GroupingState

    @Output() sortEvent = new EventEmitter<string>()

    private subscriptions: Subscription[] = []
    isLoading: boolean;

    constructor(public variantService: VariantService) { 
    }

    ngOnInit(): void {
       
    }

    sort(column: string) {
        this.sortEvent.emit(column);
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(sb => sb.unsubscribe)
        // this.variantService.patchStateReset()
    }

}
