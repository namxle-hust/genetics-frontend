
export enum RoleEnum {
    NORMAL = 'NORMAL',
    ADMIN = 'ADMIN'
}

export enum SampleTypeEnum {
    FASTQ = 'FASTQ',
    VCF = 'VCF'
}

export enum VcfTypeEnum {
    WGS = 'WGS',
    WES = 'WES'
}

export enum SampleStatusEnum {
    FASTQ_QUEUING = 'FASTQ_QUEUING',
    FASTQ_ANALYZING = 'FASTQ_ANALYZING',
    VCF_QUEUING = 'VCF_QUEUING',
    VCF_ANALYZING = 'VCF_ANALYZING',
    IMPORT_QUEUING = 'IMPORT_QUEUING',
    ANALYZED = 'ANALYZED',
    ERROR = 'ERROR'
}

export enum GenderEnum {
    MALE = 'MALE',
    FEMALE = 'FEMALE',
    UNKNOWN = 'UNKNOWN'
}

export enum FileUploadStatusEnum {
    QUEUING = 'QUEUING',
    PROGRESSING = 'PROGRESSING',
    DONE = 'DONE'
}

export enum UploadStatusEnum {
    BUSY = 'BUSY',
    FREE = 'FREE'
}