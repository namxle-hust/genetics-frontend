import { UserModel } from "./user.model"

import { BaseModel } from "src/app/shared/crud-table"

export class WorkspaceModel implements BaseModel {
    id: number
    userId: number
    user: UserModel
    name: string
    createdAt: string
    updatedAt: string
}
