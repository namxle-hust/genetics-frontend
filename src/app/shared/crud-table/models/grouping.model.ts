export type GroupingIdType = number | string;

export interface IGroupingState {
    selectedRowIds: Set<GroupingIdType | string>;
    itemIds: GroupingIdType[];
    checkAreAllRowsSelected(): boolean;
    selectRow(id: GroupingIdType): IGroupingState;
    // tslint:disable-next-line:variable-name
    clearRows(_itemIds: GroupingIdType[]): IGroupingState;
    isRowSelected(id: GroupingIdType): boolean;
    selectAllRows(): IGroupingState;
    getSelectedRows(): GroupingIdType[];
    getSelectedRowsCount(): GroupingIdType;
}

export class GroupingState implements IGroupingState {
    selectedRowIds: Set<GroupingIdType> = new Set<GroupingIdType>();
    itemIds: GroupingIdType[] = [];


    checkAreAllRowsSelected(): boolean {
        if (this.itemIds.length === 0) {
            return false;
        }

        return this.selectedRowIds.size === this.itemIds.length;
    }

    selectRow(id: GroupingIdType): GroupingState {
        if (this.selectedRowIds.has(id)) {
            this.selectedRowIds.delete(id);
        } else {
            this.selectedRowIds.add(id);
        }
        return this;
    }

    // tslint:disable-next-line:variable-name
    clearRows(_itemIds: GroupingIdType[]): GroupingState {
        this.itemIds = _itemIds;
        this.selectedRowIds = new Set<GroupingIdType>();
        return this;
    }

    isRowSelected(id: GroupingIdType): boolean {
        return this.selectedRowIds.has(id);
    }

    selectAllRows(): GroupingState {
        const areAllSelected = this.itemIds.length === this.selectedRowIds.size;
        if (areAllSelected) {
            this.selectedRowIds = new Set<GroupingIdType>();
        } else {
            this.selectedRowIds = new Set<GroupingIdType>();
            this.itemIds.forEach(id => this.selectedRowIds.add(id));
        }
        return this;
    }

    getSelectedRows(): GroupingIdType[] {
        return Array.from(this.selectedRowIds);
    }

    getSelectedRowsCount(): GroupingIdType {
        return this.selectedRowIds.size;
    }
}

export interface IGroupingView {
    grouping: GroupingState;
    ngOnInit(): void;
}
