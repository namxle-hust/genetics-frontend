import { FileUploadStatusEnum, GenderEnum, RoleEnum, AnalysisStatusEnum, SampleTypeEnum, VcfTypeEnum } from "../config/enum"

export const DEBOUNCE_TIME = 500

export const ROLES = [
    {
        name: 'Admin',
        value: RoleEnum.ADMIN,

    },
    {
        name: 'Normal',
        value: RoleEnum.NORMAL

    },
]

export const UPLOAD_FILES_STATUS = [
    {
        name: 'Queuing',
        value: FileUploadStatusEnum.QUEUING
    },
    {
        name: 'In Progress',
        value: FileUploadStatusEnum.PROGRESSING
    },
    {
        name: 'Completed',
        value: FileUploadStatusEnum.DONE
    }
]

export const MAXIMUM_UPLOAD_FILES = {
    FASTQ: 2,
    VCF: 1
}

export const SAMPLE_TYPES = [
    {
        name: 'FASTQ',
        value: SampleTypeEnum.FASTQ
    },
    {
        name: 'VCF',
        value: SampleTypeEnum.VCF
    }
]

export const VCF_TYPES = [
    {
        name: 'WGS',
        value: VcfTypeEnum.WGS
    },
    {
        name: 'WES',
        value: VcfTypeEnum.WES
    }
]

export const ANALYSIS_STATUSES = [
    {
        name: 'Fastq Queuing',
        value: AnalysisStatusEnum.FASTQ_QUEUING,
        class: 'queuing'
    },
    {
        name: 'Fastq Queuing',
        value: AnalysisStatusEnum.FASTQ_RABBITMQ_QUEING,
        class: 'queuing'
    },
    {
        name: 'Fastq Analyzing',
        value: AnalysisStatusEnum.FASTQ_ANALYZING,
        class: 'analyzing'
    },
    {
        name: 'Vcf Queuing',
        value: AnalysisStatusEnum.VCF_QUEUING,
        class: 'queuing'
    },
    {
        name: 'Vcf Queuing',
        value: AnalysisStatusEnum.VCF_RABBITMQ_QUEUING,
        class: 'queuing'
    },
    {
        name: 'Vcf Analyzing',
        value: AnalysisStatusEnum.VCF_ANALYZING,
        class: 'analyzing'
    }, {
        name: 'Import Queuing',
        value: AnalysisStatusEnum.IMPORT_QUEUING,
        class: 'queuing'
    },
    {
        name: 'Analyzed',
        value: AnalysisStatusEnum.ANALYZED,
        class: 'analyzed'
    },
    {
        name: 'Error',
        value: AnalysisStatusEnum.ERROR,
        class: 'error'
    },

]

export const GENDERS = [
    {
        name: 'Male',
        value: GenderEnum.MALE
    },
    {
        name: 'Female',
        value: GenderEnum.FEMALE
    },
    {
        name: 'Unknown',
        value: GenderEnum.UNKNOWN
    }
]