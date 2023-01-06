import { Component, EventEmitter, Input, OnInit, Output, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Select2OptionData } from 'ng-select2';
import { CHROMOSOMES, CLASSIFICATIONS } from 'src/app/core/constants';
import { ComparisonOperator } from 'src/app/core/config';
import { IVariantFilter } from 'src/app/core/models';
import { CommonService } from 'src/app/core/services';

@Component({
    selector: 'app-variant-filter',
    templateUrl: './variant-filter.component.html',
    styleUrls: ['./variant-filter.component.scss']
})
export class VariantFilterComponent implements OnInit {

    @Input() asideState: boolean
    @Output() toggleEvent = new EventEmitter<boolean>()
    @Output() applyFilter = new EventEmitter<IVariantFilter>()

    comparisonOperator = ComparisonOperator

    chromosomeList: Select2OptionData[] = []
    classificationList: Select2OptionData[] = []

    filterGroup: FormGroup

    variantFilter: IVariantFilter

    public options = {
        width: '100%',
        multiple: true,
        tags: true
    };

    constructor(
        private fb: FormBuilder,
        private commonService: CommonService,
        private renderer: Renderer2
    ) { }

    ngOnInit(): void {
        this.loadForm()
        this.chromosomeList = this.commonService.formatSelect2Data(CHROMOSOMES)
        this.classificationList = this.commonService.formatSelect2Data(CLASSIFICATIONS)
    }

    filter() {
        this.prepareData()
        console.log(this.variantFilter);
        this.applyFilter.emit(this.variantFilter)
    }

    prepareData() {
        this.variantFilter = {}

        // Chromosome
        if (this.filterGroup.value.chromosome && this.filterGroup.value.chromosome.length > 0) {
            this.variantFilter.chrom = this.filterGroup.value.chromosome.map((chrom: string) => {
                return chrom.replace('Chr ', '');
            })
        }

        // GeneName
        if (this.filterGroup.value.geneName && this.filterGroup.value.geneName.length > 0) {
            this.variantFilter.gene = this.filterGroup.value.geneName
        }

        if (this.filterGroup.value.classification && this.filterGroup.value.classification.length > 0) {
            this.variantFilter.classification = this.filterGroup.value.classification
        }

        // Allelefrequency
        if (this.filterGroup.value.AFSign && this.filterGroup.value.alleleFraction !== null) {
            if (this.filterGroup.value.AFSign == this.comparisonOperator.GREATER) {
                this.variantFilter.alleleFrequencyFrom = this.filterGroup.value.alleleFraction
            } else if (this.filterGroup.value.AFSign == this.comparisonOperator.LOWER) {
                this.variantFilter.alleleFrequencyTo = this.filterGroup.value.alleleFraction
            } 
        }

        // Gnomad
        if (this.filterGroup.value.gnomAdSign && this.filterGroup.value.gnomAd !== null) {
            if (this.filterGroup.value.gnomAdSign == this.comparisonOperator.GREATER) {
                this.variantFilter.gnomADfrom = this.filterGroup.value.gnomAd
            } else if (this.filterGroup.value.gnomAdSign == this.comparisonOperator.LOWER) {
                this.variantFilter.gnomADto = this.filterGroup.value.gnomAd
            } 
        }
        
        // Read depth
        if (this.filterGroup.value.readDepthSign && this.filterGroup.value.readDepth !== null) {
            if (this.filterGroup.value.readDepthSign == this.comparisonOperator.GREATER) {
                this.variantFilter.readDepthGreater = this.filterGroup.value.readDepth
            } else if (this.filterGroup.value.readDepthSign == this.comparisonOperator.LOWER) {
                this.variantFilter.readDepthLower = this.filterGroup.value.readDepth
            } 
        }

        console.log(this.filterGroup.value)
    }

    reset() {
        this.filterGroup.reset()
        this.filter()
    }


    toggleAside() {
        this.toggleEvent.emit(true)
    }

    loadForm() {
        this.filterGroup = this.fb.group({
            geneName: [],
            chromosome: [],
            readDepthSign: '',
            readDepth: null,
            AFSign: '',
            alleleFraction: null,
            gnomAdSign: '',
            gnomAd: null,
            annotation: [''],
            classification: [''],
        });
    }

}
