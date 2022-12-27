import { Injectable, OnDestroy } from '@angular/core';
import { Progress, Upload } from "@aws-sdk/lib-storage";
import { S3Client, S3, S3ClientConfig } from "@aws-sdk/client-s3";
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { FileCreateType, FileUploadType, IAWSCredential, IFileUpload } from '../models';
import { FileUploadStatusEnum, UploadStatusEnum } from '../config';
import { ApiService } from './api.service';

const path = 'file'

@Injectable()
export class UploadService implements OnDestroy  {

    private subscriptions: Subscription[] = [];

    currentFileUpload$: Observable<FileUploadType>
    currentFileUploadSubject: BehaviorSubject<FileUploadType>
    
    uploadStatus$: Observable<UploadStatusEnum>
    uploadStatusSubject: BehaviorSubject<UploadStatusEnum>

    listFileUploaded$: Observable<FileCreateType>
    listFileUploadedSubject: BehaviorSubject<FileCreateType>

    get listFileUploadValue(): FileCreateType {
        return this.listFileUploadedSubject.value
    }

    set listFileUploadValue(data: FileCreateType) {
        this.listFileUploadedSubject.next(data);
    }

    get currentFileUploadValue(): FileUploadType {
        return this.currentFileUploadSubject.value
    }

    set currentFileUploadValue(file: FileUploadType) {
        if (file) {
            this.currentFileUploadSubject.next(file)
        }
    }

    get uploadStatusValue(): UploadStatusEnum {
        return this.uploadStatusSubject.value
    }

    set uploadStatusValue(status: UploadStatusEnum) {
        this.uploadStatusSubject.next(status); 
    }

    private parallelUploads3: Upload;

    private s3: S3Client;

    constructor(private apiService: ApiService) {
        this.currentFileUploadSubject = new BehaviorSubject<FileUploadType>(undefined);
        this.currentFileUpload$ = this.currentFileUploadSubject.asObservable();

        this.uploadStatusSubject = new BehaviorSubject<UploadStatusEnum>(UploadStatusEnum.FREE)
        this.uploadStatus$ = this.uploadStatusSubject.asObservable();

        this.listFileUploadedSubject = new BehaviorSubject<FileCreateType>(undefined)
        this.listFileUploaded$ = this.listFileUploadedSubject.asObservable();
    }

    async abortCurrentUpload() {
        await this.parallelUploads3.abort()
        this.currentFileUploadValue = undefined;
        this.uploadStatusValue = UploadStatusEnum.FREE;
    }

    doUpload(file: IFileUpload) {
        if (this.uploadStatusValue == UploadStatusEnum.BUSY) {
            return;
        }
        
        // Not allow saving data
        this.listFileUploadedSubject.next(undefined);

        const sb = this.apiService.get(`${path}/aws-credentials`).subscribe(async (response: IAWSCredential) => {
            this.s3 = new S3Client({
                credentials: {
                    accessKeyId: response.AccessKeyId,
                    secretAccessKey: response.SecretAccessKey,
                    sessionToken: response.SessionToken
                },
                region: 'ap-southeast-1'
            })

            file.status = FileUploadStatusEnum.PROGRESSING;

            this.currentFileUploadValue = file;
            this.uploadStatusValue = UploadStatusEnum.BUSY

            let fileData = file.file;

            this.parallelUploads3 = new Upload({
                client: this.s3,
                params: {
                    Body: fileData,
                    Bucket: 'varigenes-storage',
                    Key: fileData.name
                },
                queueSize: 4, // optional concurrency configuration
                partSize: 1024 * 1024 * 5, // optional size of each part, in bytes, at least 5MB
                leavePartsOnError: false, // optional manually handle dropped parts
            });

            this.parallelUploads3.on("httpUploadProgress", (uploadProgress: Progress) => {

                if (uploadProgress.loaded && uploadProgress.total) {
                    file.progress = Math.floor((uploadProgress.loaded / uploadProgress.total) * 100);
                    this.currentFileUploadValue = file;
                }

            });

            try {
                await this.parallelUploads3.done();

                this.parallelUploads3.off

                file.status = FileUploadStatusEnum.DONE

                this.currentFileUploadValue = file;

                console.log(this.parallelUploads3);

                this.uploadStatusValue = UploadStatusEnum.FREE

            } catch (error) {
                console.log(error);
            }  

        })

        this.subscriptions.push(sb);
    }

    ngOnDestroy(): void {
        console.log('Service Destroy');
        this.subscriptions.forEach(sb => sb.unsubscribe());
    }
}
