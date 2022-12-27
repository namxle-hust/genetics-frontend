import { Injectable } from "@angular/core";
import { MAXIMUM_UPLOAD_FILES, SampleTypeEnum, SAMPLE_TYPES } from "../config";

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
}