import { UserModel } from "./user.model"

import { BaseModel } from "src/app/shared/crud-table"


export interface IWorkspaceCount {
    analyses: number
}
export class WorkspaceModel implements BaseModel {
    id: number
    userId: number
    user: UserModel
    _count: IWorkspaceCount
    name: string
    createdAt: string
    updatedAt: string
}
