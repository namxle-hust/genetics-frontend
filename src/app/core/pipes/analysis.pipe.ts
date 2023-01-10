import { Pipe, PipeTransform } from '@angular/core';
import { AnalysisStatusEnum, VcfTypeEnum } from '../config';
import { ANALYSIS_STATUSES, VCF_TYPES } from '../constants';


@Pipe({
    name: 'vcfTypeConverter'
})
export class VcfTypeConverterPipe implements PipeTransform {

    transform(value: VcfTypeEnum): String {
        let type = VCF_TYPES.find(type => type.value == value);
        return type ? type.name : '';
    }

}

@Pipe({
    name: 'analysisStatusConverter'
})
export class AnalysisStatusConverterPipe implements PipeTransform {

    transform(value: AnalysisStatusEnum): String {
        let type = ANALYSIS_STATUSES.find(type => type.value == value);
        return type ? type.name : '';
    }

}

@Pipe({
    name: 'analysisAvailable'
})
export class AnalysisAvailablePipe implements PipeTransform {

    transform(value: AnalysisStatusEnum): boolean {
        if (value == AnalysisStatusEnum.ANALYZED) {
            return true
        }
        return false
    }
}

@Pipe({
    name: 'analysisClass'
})
export class AnalysisClassPipe implements PipeTransform {

    transform(value: AnalysisStatusEnum): String {
        let type = ANALYSIS_STATUSES.find(type => type.value == value);
        return type ? type.class : '';
    }
}



