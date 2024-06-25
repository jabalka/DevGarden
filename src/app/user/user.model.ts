import { ObjectId } from 'bson';

export interface IUser {
    _id: ObjectId,
    email: string,
    hashedPassword: string,
}

export interface UserResponse {
    
}

export interface UserModel extends IUser {
    username: string,
    name: string,
    phone: number,
}

