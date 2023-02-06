import { Pipe, PipeTransform } from '@angular/core';
import { EthnicityEnum, GenderEnum, SampleTypeEnum } from '../config';
import { ETHNICITIES, GENDERS, SAMPLE_TYPES } from '../constants';

@Pipe({
    name: 'sampleTypeConverter'
})
export class SampleTypeConverterPipe implements PipeTransform {

    transform(value: SampleTypeEnum): String {
        let type = SAMPLE_TYPES.find(type => type.value == value);
        return type ? type.name : '';
    }

}


@Pipe({
    name: 'genderConverter'
})
export class GenderConverterPipe implements PipeTransform {

    transform(value: GenderEnum | undefined): String {
        if (!value) {
            return ''
        }
        let type = GENDERS.find(type => type.value == value);
        return type ? type.name : '';
    }

}
@Pipe({
    name: 'ethnicityConverter'
})
export class EthnicityConverterPipe implements PipeTransform {

    transform(value: EthnicityEnum | undefined): String {
        if (!value) {
            return '';
        }
        let type = ETHNICITIES.find(type => type.value == value);
        return type ? type.name : '';
    }

}