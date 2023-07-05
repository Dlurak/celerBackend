import { ObjectId } from "mongodb";

export const cargoSpecialCharacteristicsArray = [
    "fragile",
    "flamable",
    "explosive",
    "living",
    "none"
] as const;


export type cargoSpecialCharacteristics = typeof cargoSpecialCharacteristicsArray[number];

export interface RideRequest {
    _id: ObjectId;
    requestor: ObjectId;
    startLocation: [number, number]; // [lat, lng]
    destinationLocation: [number, number]; // [lat, lng]
    createdAt: number;
    status: "open"|"accepted"|"completed"|"processing"|"rejected";
    title: string;

    cargoWeight: number; // in kg
    cargoVolume: number; // in liters
    cargoDescription: string; // a description of the cargo
    cargoSpecialCharacteristics: cargoSpecialCharacteristics[];

    acceptor?: ObjectId;
    acceptedAt?: number;
    completedAt?: number;
    rejectionReason?: string;
    rejectedAt?: number;
}