import { FileUploadStatusEnum, GenderEnum, RoleEnum, SampleStatusEnum, SampleTypeEnum, VcfTypeEnum } from "./enum"

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

export const SAMPLE_STATUSES = [
    {
        name: 'Fastq Queuing',
        value: SampleStatusEnum.FASTQ_QUEUING
    },
    {
        name: 'Fastq Analyzing',
        value: SampleStatusEnum.FASTQ_ANALYZING
    }, {
        name: 'Vcf Queuing',
        value: SampleStatusEnum.VCF_QUEUING
    },
    {
        name: 'Vcf Analyzing',
        value: SampleStatusEnum.VCF_ANALYZING
    }, {
        name: 'Import Queuing',
        value: SampleStatusEnum.IMPORT_QUEUING
    },
    {
        name: 'Analyzed',
        value: SampleStatusEnum.ANALYZED
    },
    {
        name: 'Error',
        value: SampleStatusEnum.ERROR
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