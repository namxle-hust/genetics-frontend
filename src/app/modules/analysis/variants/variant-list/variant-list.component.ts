import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { IIgvUrl, VariantModel } from 'src/app/core/models';
import { AnalysisService, VariantService } from 'src/app/core/services';
import { GroupingState, SortState } from 'src/app/shared/crud-table';
import { IgvModalComponent } from '../igv-modal/igv-modal.component';

@Component({
    selector: 'app-variant-list',
    templateUrl: './variant-list.component.html',
    styleUrls: ['./variant-list.component.scss'],
    providers: [AnalysisService]
})
export class VariantListComponent implements OnInit, OnDestroy {

    @Input() sorting: SortState
    @Input() grouping: GroupingState

    @Output() sortEvent = new EventEmitter<string>()

    private subscriptions: Subscription[] = []
    isLoading: boolean;

    constructor(
        public variantService: VariantService,
        private modalService: NgbModal,
        private analysisService: AnalysisService
    ) {
    }

    ngOnInit(): void {

    }

    sort(column: string) {
        this.sortEvent.emit(column);
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(sb => sb.unsubscribe)
        this.variantService.patchStateReset()
        this.analysisService.patchStateReset()
    }

    getIgvInfo(chrom: string, position: number) {
        const sb = this.analysisService.getIgvUrls(this.variantService.analysisId)
            .subscribe((data: IIgvUrl) => {
                if (data && data.bamUrl && data.indexBamUrl) {
                    let bamUrl = data.bamUrl;
                    let indexBamUrl = data.indexBamUrl
                    let locus = `${chrom}:${position}`

                    this.openeIgvModal(bamUrl, indexBamUrl, locus)

                } else {
                    let url = "http://genome.ucsc.edu/cgi-bin/hgTracks?db=hg19&lastVirtModeType=default&lastVirtModeExtraState=&virtModeType=default&virtMode=0&nonVirtPosition=&position=chr" + chrom + ":" + position + "-" + position;
                    window.open(url);

                }
            })

        this.subscriptions.push(sb);
    }

    openeIgvModal(bamUrl: string, indexBamUrl: string, locus: string): void {
        const modalRef = this.modalService.open(IgvModalComponent, { size: 'lg' });
        modalRef.componentInstance.bamUrl = bamUrl;
        modalRef.componentInstance.indexBamUrl = indexBamUrl;
        modalRef.componentInstance.locus = locus;

        modalRef.result.then(
            () => { },
            () => { },
        );
    }
}
