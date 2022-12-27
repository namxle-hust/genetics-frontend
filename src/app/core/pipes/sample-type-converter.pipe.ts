import { Pipe, PipeTransform } from '@angular/core';
import { SampleTypeEnum, SAMPLE_TYPES } from '../config';


@Pipe({
    name: 'sampleTypeConverter'
})
export class SampleTypeConverterPipe implements PipeTransform {

    transform(value: SampleTypeEnum): String {
        let type = SAMPLE_TYPES.find(type => type.value == value);
        return type ? type.name : '';
    }

}
