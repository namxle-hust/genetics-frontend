import { UserModel } from "./user.model"
import { BaseModel } from "src/app/shared/crud-table"
import { SampleTypeEnum } from "../config"
import { IFile } from "./file.model"

export interface IBatch {
    id: number
    userId?: number
    user?: UserModel
    name: string
    type: SampleTypeEnum
    files: IFile[]
    createdAt?: string
    updatedAt?: string

}

export class BatchModel implements IBatch, BaseModel {
    id: number
    userId?: number
    user?: UserModel
    name: string
    type: SampleTypeEnum
    files: IFile[]
    createdAt?: string
    updatedAt?: string

    constructor() {
        // this.id = batch.id
        // this.userId = batch.userId
        // this.user = batch.user
        // this.name = batch.name
        // this.type = batch.type
        // this.files = batch.files
        // this.createdAt = batch.createdAt
        // this.updatedAt = batch.updatedAt
    }
}
