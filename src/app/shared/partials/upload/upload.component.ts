import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Event } from 'aws-sdk/clients/s3';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { FileUploadStatusEnum, SampleTypeEnum, UploadStatusEnum } from 'src/app/core/config';
import { FileCreate, FileUpload, FileUploadType, IFile, IFileUpload } from 'src/app/core/models';
import { CommonService, UploadService } from 'src/app/core/services';

@Component({
    selector: 'app-upload',
    templateUrl: './upload.component.html',
    styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit, OnDestroy {

    @Input() sampleType: SampleTypeEnum;
    @Input() isRequired: boolean;
    @Input() sampleTypeChange$: Observable<boolean>


    @ViewChild('fileDropRef', { static: true }) fileDropRef: ElementRef

    public FILE_UPLOAD_STATUS = FileUploadStatusEnum
    public FILE_UPLOAD_TYPE = SampleTypeEnum

    private subscriptions: Subscription[] = []

    private queuingFiles: IFileUpload[] = []
    
    public fileList: IFileUpload[] = [];

    private fileArrive$: Observable<boolean>;
    private fileArriveSubject: BehaviorSubject<boolean>;

    get listFiles(): IFile[] {
        let files = this.fileList.map(data => {
            return {
                uploadedName: data.file.name,
                name: data.file.name,
                size: data.file.size
            }
        })
        return files;
    }

    constructor(
        private uploadService: UploadService,
        private commonService: CommonService,
        private toastr: ToastrService
    ) {
        this.fileArriveSubject = new BehaviorSubject<boolean>(false);
        this.fileArrive$ = this.fileArriveSubject.asObservable();
    }

    ngOnInit(): void {
        const sbUploadStatus = this.uploadService.uploadStatus$.subscribe((value: UploadStatusEnum) => {
            if (value == UploadStatusEnum.FREE) {
                this.doUpload();
            }
            this.checkSaveStatus();
        })

        this.subscriptions.push(sbUploadStatus);

        const sbFileArrive = this.fileArrive$.subscribe((value) => {
            if (value && this.uploadService.uploadStatusValue == UploadStatusEnum.FREE) {
                this.doUpload();
            }
        })

        this.subscriptions.push(sbFileArrive);
        
        const sbCurrentUploadFile = this.uploadService.currentFileUpload$.subscribe((data) => {
            if (data) {
                let index = this.fileList.findIndex((file => file.id == data.id ))
                this.fileList[index].progress = data.progress;
            }
        })
        this.subscriptions.push(sbCurrentUploadFile);

        const sbSampleTypeChange = this.sampleTypeChange$.subscribe((isChange: boolean) => {
            if (isChange) {
                this.resetAllFiles()
            }
        })
        this.subscriptions.push(sbSampleTypeChange);

    }

    get maximumFileUpload(): number {
        return this.commonService.getMaximumFileUpload(this.sampleType)
    }


    onFileDropped(event: any) {
        this.handleFile(event.target.files);
    }

    fileBrowseHandler(event: any) {
        this.handleFile(event.target.files);
    }

    handleFile(files: File[]) {
        console.log(this.fileList);
        if (this.fileList.length == this.maximumFileUpload) {
            this.toastr.error('You have reached maximum number of files!');
            return;
        }


        let reg;
        let message;

        if (this.sampleType == SampleTypeEnum.FASTQ) {
            reg = /^.*\.(fastq|fastq.gz|fq.gz|fq)$/
            message = 'Fastq File must end with `.fastq` , `.fastq.gz` , `.fq`or`.fq.gz`'
        } else {
            reg = /^.*\.(vcf|vcf.gz)$/
            message = 'Vcf File must end with `.vcf` or `.vcf.gz`'
        }

        for (let file of files) {
            if (reg.test(file.name)) {
                continue
            }
            this.toastr.error(message)
            return false;
        }

        for (let file of files) {
            let data: IFileUpload = new FileUpload(file);
            this.fileList.push(data);
            this.queuingFiles.push(data);
        }

        this.fileArriveSubject.next(true);
    }

    doUpload() {
        let file = this.queuingFiles.shift();
        if (file) {
            this.uploadService.doUpload(file);
        }
    }

    checkSaveStatus() {
        // If there are no queuing files & all file in the list are uploaded then update the result.
        if (this.queuingFiles.length == 0 && this.fileList.filter(file => file.status != FileUploadStatusEnum.DONE).length == 0) {
            if (this.isRequired) {
                if (this.fileList.length != this.maximumFileUpload) {
                    // If the fileList does not have exact number of files required
                    // then do not allow save
                    this.uploadService.listFileUploadedSubject.next(undefined);
                    return;
                }
            }
            if (this.fileList.length > 0 && this.fileList.length != this.maximumFileUpload) {
                this.uploadService.listFileUploadedSubject.next(undefined);
                return;
            }
            this.uploadService.listFileUploadedSubject.next(this.fileList.map(file => new FileCreate(file)))
        }
    }

    async resetAllFiles() {
        this.queuingFiles = [];
        this.fileList = [];

        this.fileDropRef.nativeElement.value = ''

        let file = this.uploadService.currentFileUploadValue
        if (file && file.id) {
            await this.uploadService.abortCurrentUpload();
        }
    }

    async deleteFile(id: string) {
        let index;

        index = this.fileList.findIndex(file => file.id == id);
        if (index != -1) {
            this.fileList.splice(index, 1)
        }

        index = this.queuingFiles.findIndex(file => file.id == id);
        if (index != -1) {
            this.queuingFiles.splice(index, 1);
        }

        let file = this.uploadService.currentFileUploadValue
        if (file && file.id && file.id == id) {
            await this.uploadService.abortCurrentUpload();
        } else {
            this.checkSaveStatus();
        }
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(sb => sb.unsubscribe());
    }

    

}
