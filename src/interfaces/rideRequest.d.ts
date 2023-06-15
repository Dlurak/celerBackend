import { ObjectId } from "mongodb";

interface RideRequest {
    _id: ObjectId;
    requestor: ObjectId;
    startLocation: [number, number]; // [lat, lng]
    destinationLocation: [number, number]; // [lat, lng]
    createdAt: number;
    status: "open"|"accepted"|"completed"|"processing"|"rejected";

    cargoWeight: number; // in kg
    cargoVolume: number; // in liters
    cargoDescription: string; // a description of the cargo
    cargoSpecialCharacteristics: "fragile"|"flammable"|"explosive"|"living"|"none";

    acceptor?: ObjectId;
    acceptedAt?: number;
    completedAt?: number;
    rejectionReason?: string;
    rejectedAt?: number;
}