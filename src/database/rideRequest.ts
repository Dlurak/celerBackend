import { db } from './database';
import { RideRequest } from '../interfaces/rideRequest';
import { doesUserIdExist, findUsers } from './users';
import { haversineDistance } from '../utils/distanceCalculator';


/**
 * A function to add a ride request to the database, if the options are valid
 * @param options The options for the ride request
 * @returns "Success" if the ride request was added successfully, "error" when the save failed, or a string describing the error if the options are invalid
 */
export async function addRideRequest(options: RideRequest): Promise<string> {
    const [isValid, error] = await validateRideRequestOptions(options);
    if (!isValid) {
        return error;
    }

    return db.collection('requestedRides').insertOne(options)
        .then(() => "success")
        .catch(() => "error");
}

/**
 * A function to validate the options for a ride request
 * @param options The options to validate
 * @returns A boolean indicating whether the options are valid and a string describing the error if there is one
 */
async function validateRideRequestOptions(options: RideRequest): Promise<[boolean, string]> {
    if (!doesUserIdExist(options.requestor, db)) {
        return [false, "requestor does not exist"];
    }
    console.log(options.requestor);
    const userList = await findUsers({ _id: options.requestor }, db);
    const user = userList[0];

    console.table({
        user,
        userList
    });

    if (user.blocked) {
        return [false, "requestor is blocked"];
    } else if (haversineDistance(options.startLocation, options.destinationLocation) < 0.1) {
        return [false, "start and destination are too close"];
    } else if (haversineDistance(options.startLocation, options.destinationLocation) > 1000) {
        return [false, "start and destination are too far apart"];
    } else if (options.cargoWeight < 0) {
        return [false, "cargo weight can't be negative"];
    } else if (options.cargoVolume < 0) {
        return [false, "cargo volume can't be negative"];
    }

    return [true, ""];
}

/**
 * A function to get all ride requests in the database
 * In the future this will need seach filters and pagination
 * @returns A promise that resolves to an array of all ride requests in the database
 */
export function getAllRideRequests() {
    return db.collection('requestedRides').find().toArray();
}

