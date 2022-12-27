import { Pipe, PipeTransform } from '@angular/core';
import { SampleStatusEnum, SAMPLE_STATUSES, VcfTypeEnum, VCF_TYPES } from '../config';


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
    name: 'sampleStatusConverter'
})
export class SampleStatusConverterPipe implements PipeTransform {

    transform(value: SampleStatusEnum): String {
        let type = SAMPLE_STATUSES.find(type => type.value == value);
        return type ? type.name : '';
    }

}


