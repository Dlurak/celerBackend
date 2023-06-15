import { ObjectId } from "mongodb";

interface User {
    _id: ObjectId;
    username: string;
    password: string;
    createdAt: number;

    blocked: boolean;
}

interface UserSearchOptions {
    _id?: ObjectId;
    username?: string;
    createdAt?: number;
}