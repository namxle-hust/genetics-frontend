import { BaseModel } from "src/app/shared/crud-table"
import { GenderEnum, AnalysisStatusEnum, VcfTypeEnum } from "../config"
import { SampleModel } from "./sample.model"
import { WorkspaceModel } from "./workspace.model"

export interface IAnalysis {
    id: number
    workspaceId: number
    sampleId: number
    name: string
    totalVariants?: number
    totalGenes?: number
    description?: string
    workspace?: WorkspaceModel
    sample?: SampleModel
    vcfType: VcfTypeEnum
    createdAt: string
    updatedAt: string

}

export interface IAnalysisQCUrl {
    url: string
}

export class AnalysisModel implements IAnalysis, BaseModel {
    id: number

    sampleId: number
    totalVariants?: number
    totalGenes?: number
    description?: string
    vcfType: VcfTypeEnum

    workspace?: WorkspaceModel
    sample?: SampleModel

    status: AnalysisStatusEnum

    gender: GenderEnum

    createdAt: string
    updatedAt: string

    name: string
    workspaceId: number


    constructor() {
    }

}
