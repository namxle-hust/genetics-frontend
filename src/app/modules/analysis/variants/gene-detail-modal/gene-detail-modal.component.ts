import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { IGeneDetail, IVariant } from 'src/app/core/models';
import { AnalysisService } from 'src/app/core/services';

enum TABS {
    GENE = 'gene',
    VARIANT = 'variant'
}


@Component({
    selector: 'app-gene-detail-modal',
    templateUrl: './gene-detail-modal.component.html',
    styleUrls: ['./gene-detail-modal.component.scss']
})
export class GeneDetailModalComponent implements OnInit {
    @Input() variantId: string;
    @Input() geneName: string;
    @Input() analysisId: number

    public currentTabID: TABS = TABS.GENE

    public tabList = TABS

    public tabs = [
        {
            name: 'Gene Detail',
            id: TABS.GENE,
            isSelected: true,
        },
        {
            name: 'Variant Detail',
            id: TABS.VARIANT,
            isSelected: false
        }
    ]

    public geneData: IGeneDetail

    public geneDataSubject: BehaviorSubject<IGeneDetail>
    public geneData$: Observable<IGeneDetail>

    public variantDataSubject: BehaviorSubject<any>
    public variantData$: Observable<any>

    private subscriptions: Subscription[] = [];


    private isLoadingSubject: BehaviorSubject<boolean>
    public isLoading$: Observable<boolean>

    constructor(public modal: NgbActiveModal, private analysisService: AnalysisService) { 
        this.isLoadingSubject = new BehaviorSubject(false)
        this.isLoading$ = this.isLoadingSubject.asObservable()

        this.geneDataSubject = new BehaviorSubject({})
        this.geneData$ = this.geneDataSubject.asObservable()

        this.variantDataSubject = new BehaviorSubject({})
        this.variantData$ = this.variantDataSubject.asObservable()
    }




    ngOnInit(): void {
        this.loadGeneDetail();
        this.loadVariants();
    }


    loadVariants(): void {
        const sb  = this.analysisService.getVariantsInfo(this.variantId, this.analysisId).subscribe((data: IGeneDetail) => {
            console.log(data);
            this.variantDataSubject.next(data); 
        })
        this.subscriptions.push(sb);
    }

    loadGeneDetail(): void {
        const sb  = this.analysisService.getGeneInfo(this.geneName).subscribe((data: IGeneDetail) => {
            console.log(data);
            this.geneDataSubject.next(data); 
        })
        this.subscriptions.push(sb);
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(sb => sb.unsubscribe());
    }

    changeTab(id: TABS) {
        this.tabs.forEach(tab => {
            if (tab.id == id) {
                tab.isSelected = true
                this.currentTabID = id
            } else {
                tab.isSelected = false
            }
        })
    }
        

}
