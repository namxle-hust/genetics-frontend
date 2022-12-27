import { BaseModel } from "src/app/shared/crud-table"
import { GenderEnum, SampleStatusEnum, VcfTypeEnum } from "../config"
import { BatchModel } from "./batch.model"
import { WorkspaceModel } from "./workspace.model"

export interface ISample {
    id: number
    workspaceId: number
    batchId: number
    name: string
    totalVariants?: number
    totalGenes?: number
    description?: string
    workspace?: WorkspaceModel
    batch?: BatchModel
    vcfType: VcfTypeEnum
    createdAt: string
    updatedAt: string

}

export class SampleModel implements ISample, BaseModel {
    id: number

    batchId: number
    totalVariants?: number
    totalGenes?: number
    description?: string
    vcfType: VcfTypeEnum

    workspace?: WorkspaceModel
    batch?: BatchModel

    status: SampleStatusEnum

    gender: GenderEnum

    createdAt: string
    updatedAt: string

    name: string
    workspaceId: number


    constructor() {
    }

}
