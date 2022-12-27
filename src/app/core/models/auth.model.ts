import { UserModel } from "./user.model";

export class AuthModel {
    access_token: string;

    setAuth(auth: AuthModel) {
        this.access_token = auth.access_token;
    }
}

export class IUserRegistration {
    firstName: string
    lastName: string
    email: string
    password: string

    setUser(_user: unknown) {
        const user = _user as IUserRegistration;
        this.firstName = user.firstName;
        this.lastName = user.lastName
        this.email = user.email
    }
}
