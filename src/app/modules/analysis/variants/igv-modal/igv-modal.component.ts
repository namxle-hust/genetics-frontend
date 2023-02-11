import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as IGV from 'packages/igv/igv';
import { Observable } from 'rxjs';
import { BehaviorSubject, Subscription } from 'rxjs';
import { IIgvUrl } from 'src/app/core/models';
import { AnalysisService } from 'src/app/core/services';

@Component({
    selector: 'app-igv-modal',
    templateUrl: './igv-modal.component.html',
    styleUrls: ['./igv-modal.component.scss'],
})
export class IgvModalComponent implements OnInit {

    private igv: any;
    @Input() locus: string
    @Input() indexBamUrl: string;
    @Input() bamUrl: string;

    @ViewChild('igv', { static: true }) igvDiv: ElementRef;

    private subscriptions: Subscription[] = [];

    private isLoadingSubject: BehaviorSubject<boolean>
    public isLoading$: Observable<boolean>

    constructor(public modal: NgbActiveModal, private analysisService: AnalysisService) {
        this.igv = IGV
        this.isLoadingSubject = new BehaviorSubject(false)
        this.isLoading$ = this.isLoadingSubject.asObservable()
    }

    ngOnInit(): void {
        this.openIGVBrowser()
    }


    ngOnDestroy(): void {
        this.subscriptions.forEach(sb => sb.unsubscribe());
    }

    openIGVBrowser() {
        // this.isLoadingSubject.next(true);

        let self = this;
        let options =
        {
            genome: "hg19",
            locus: this.locus,
            showKaryo: false,
            showIdeogram: true,
            showNavigation: true,
            showRuler: true,
            showCenterGuide: true,

            tracks: [
                {
                    colorBy: "strand",
                    displayMode: "EXPANDED",
                    filename: "realigned.bam",
                    format: "bam",
                    indexURL: this.indexBamUrl,
                    label: "Sample",
                    noSpinner: true,
                    order: 1,
                    sourceType: "file",
                    type: "alignment",
                    url: this.bamUrl,
                    visibilityWindow: 300000000
                },
                // {
                //     displayMode: "EXPANDED",
                //     filename: "gencode.v18.annotation.sorted.gtf.gz",
                //     format: "gtf",
                //     indexURL: "https://s3-us-west-2.amazonaws.com/btgenomics-s3-prod/public/hg19/gencode.v18.annotation.sorted.gtf.gz.tbi",
                //     name: "Genes",
                //     noSpinner: true,
                //     order: 2,
                //     sourceType: "file",
                //     type: "annotation",
                //     url: "https://s3-us-west-2.amazonaws.com/btgenomics-s3-prod/public/hg19/gencode.v18.annotation.sorted.gtf.gz"
                // },
                // {
                //     noSpinner: true,
                //     order: "-1.7976931348623157e+308",
                //     type: "sequence",
                // }
            ]
        };



        this.igv.createBrowser(this.igvDiv.nativeElement, options)
            .then(function (browser: any) {
                console.log("Created IGV browser");

            })
            .catch((error: any) => {
                console.log("Cannot create IGV browser");
                console.log("Create igv Error ", error);
            })
    }
}


