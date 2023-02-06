import { UserModel } from "./user.model"
import { BaseModel } from "src/app/shared/crud-table"
import { EthnicityEnum, GenderEnum, SampleTypeEnum } from "../config"
import { IFile } from "./file.model"

export interface ISample {
    id: number
    userId?: number
    user?: UserModel
    name: string
    type: SampleTypeEnum
    files: IFile[]
    createdAt?: string
    updatedAt?: string

    firstName?: string
    lastName?: string
    dob?: string;
    ethnicity?: EthnicityEnum;
    gender?: GenderEnum

}

export class SampleModel implements ISample, BaseModel {
    id: number
    userId?: number
    user?: UserModel
    name: string
    type: SampleTypeEnum
    files: IFile[]
    createdAt?: string
    updatedAt?: string

    firstName?: string
    lastName?: string
    dob?: string;
    ethnicity?: EthnicityEnum;
    gender?: GenderEnum

    constructor() {
    }
}
