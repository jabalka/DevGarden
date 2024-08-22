import { ObjectId } from 'bson';

export interface IUser {
    _id: ObjectId,
    email: string,
    hashedPassword: string,
}

export interface UserModel extends IUser {
    username: string,
    name: string,
    phone: string,
    profilePicture: string,
    accessToken: string,
}

