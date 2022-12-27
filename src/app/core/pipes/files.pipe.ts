import { Pipe, PipeTransform } from '@angular/core';
import { FileUploadStatusEnum, UPLOAD_FILES_STATUS } from '../config';


@Pipe({
    name: 'formatBytes'
})
export class FormatBytesPipe implements PipeTransform {

    transform(bytes: number, decimals = 2): String {
        if (bytes === 0) {
            return "0 Bytes";
        }
        const k = 1024;
        const dm = decimals <= 0 ? 0 : decimals;
        const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
    }

}

@Pipe({
    name: 'uploadFileStatusPipe'
})
export class UploadFileileStatusConverterPipe implements PipeTransform {
    transform(value: FileUploadStatusEnum): String {
        let status = UPLOAD_FILES_STATUS.find(status => status.value == value);
        return status ? status.name : '';
    }
}