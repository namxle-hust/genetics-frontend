import { WorkspaceModel } from "./workspace.model"

export enum UserRole {
    NORMAL = 'NORMAL',
    ADMIN = 'ADMIN'
}


export class UserModel {
    firstName: string
    lastName: string
    email: string
    role: UserRole
    workspaces?: WorkspaceModel[]
}