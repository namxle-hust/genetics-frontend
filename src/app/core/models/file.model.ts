import { FileUploadStatusEnum } from "../config"
import { CommonService } from "../services"

export interface IFileUpload {
    id: string
    file: File
    status: FileUploadStatusEnum
    progress: number
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

    generateId(length: number): string {
        var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var result = '';
        for (var i = 0; i < length; i++) {
            result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
        }
        return result;
    }

    constructor(file: File) {
    
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
        this.uploadedName = data.file.name
        this.name = data.file.name
        this.size = data.file.size
    }
}

export interface IFile {
    id?: number
    name: string
    size: number
    batchId?: number
    uploadedName: string
}

export class FileModel implements IFile {
    id: number
    name: string
    size: number
    batchId: number
    uploadedName: string
}