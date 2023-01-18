import { FileUploadStatusEnum } from "../config"
import { CommonService } from "../services"

export interface IFileUpload {
    id: string
    file: File
    status: FileUploadStatusEnum
    progress: number
    name: string
}

export interface IAWSCredential {
    AccessKeyId: string,
    SecretAccessKey: string,
    SessionToken: string
}

export class FileUpload implements IFileUpload {

    id: string
    file: File
    status: FileUploadStatusEnum
    progress: number
    name: string

    generateName(fileName: string): string {
        let currentDate = new Date()

        let year = currentDate.getFullYear();
        let month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
        let date = ("0" + currentDate.getDate()).slice(-2)
        let hour = ("0" + currentDate.getHours()).slice(-2)
        let minutes = ("0" + currentDate.getMinutes()).slice(-2)
        let seconds = ("0" + currentDate.getSeconds()).slice(-2)
        let msecs = ('00' + currentDate.getMilliseconds()).slice(-3);

        return `${year}${month}${date}${hour}${minutes}${seconds}${msecs}_${fileName}`
    }

    generateId(length: number): string {
        var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var result = '';
        for (var i = 0; i < length; i++) {
            result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
        }
        return result;
    }

    constructor(file: File) {
        this.name = this.generateName(file.name.replace(' ', '_'))
        this.id = this.generateId(6)
        this.file = file
        this.status = FileUploadStatusEnum.QUEUING
        this.progress = 0
    }   
}

export type FileUploadType = IFileUpload | undefined


export type FileCreateType = IFile[] | undefined

export class FileCreate implements IFile {
    uploadedName: string
    name: string
    size: number
    constructor(data: IFileUpload) {
        this.uploadedName = data.name
        this.name = data.file.name
        this.size = data.file.size
    }
}

export interface IFile {
    id?: number
    name: string
    size: number
    sampleId?: number
    uploadedName: string
}

export class FileModel implements IFile {
    id: number
    name: string
    size: number
    sampleId: number
    uploadedName: string
}