import { Injectable } from "@angular/core";
import { Select2OptionData } from "ng-select2";
import { SampleTypeEnum,  } from "../config";
import { SAMPLE_TYPES, MAXIMUM_UPLOAD_FILES } from "../constants";

@Injectable({ providedIn: 'root' })
export class CommonService {
    getMaximumFileUpload(sampleType: SampleTypeEnum): number {
        if (sampleType == SampleTypeEnum.FASTQ) {
            return MAXIMUM_UPLOAD_FILES.FASTQ
        }
        return MAXIMUM_UPLOAD_FILES.VCF
    }

    generateRandomString(length: number): string {
        var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var result = '';
        for (var i = 0; i < length; i++) {
            result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
        }
        return result;
    }

    formatSelect2Data(data: any[]): Select2OptionData[] {
        return data.map((element) =>  { 
            return {
                id: element,
                text: element
            } 
        })
    }
}