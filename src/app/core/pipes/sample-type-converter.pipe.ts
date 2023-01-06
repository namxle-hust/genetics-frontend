import { Pipe, PipeTransform } from '@angular/core';
import { SampleTypeEnum } from '../config';
import { SAMPLE_TYPES } from '../constants';

@Pipe({
    name: 'sampleTypeConverter'
})
export class SampleTypeConverterPipe implements PipeTransform {

    transform(value: SampleTypeEnum): String {
        let type = SAMPLE_TYPES.find(type => type.value == value);
        return type ? type.name : '';
    }

}
