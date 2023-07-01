import express, { Request, Response } from 'express';
import authenticate from '../middleware/auth';
import { addRideRequest } from '../database/rideRequest';
import { findUsers } from '../database/users';
import { db } from '../database/database';
import { ObjectId } from 'mongodb';
import { RideRequest, cargoSpecialCharacteristics, cargoSpecialCharacteristicsArray } from '../interfaces/rideRequest';
// import { RideRequest, cargoSpecialCharacteristics } from '../interfaces/rideRequest';


const router = express.Router();

router.post('/', authenticate, async (req: Request, res: Response) => {
    const reqBody = req.body;
    const userID = (await findUsers({ username: res.locals.jwtPayload.username }, db))[0]._id;


    const requiredKeys: { [key: string]: "string"|"object"|"number" } = {
        'startLocation': 'object', // sadly arrays are objects in js
        'destinationLocation': 'object',
        'cargoWeight': 'number',
        'cargoVolume': 'number',
        'cargoDescription': 'string'
    };

    for (const key of Object.keys(requiredKeys)) {
        if (!reqBody.hasOwnProperty(key)) {
            res.status(400).json({ error: `missing ${key}` });
            return;
        } else if ((typeof reqBody[key]).toLowerCase() !== requiredKeys[key]) {
            res.status(400).json({ error: `${key} must be of type ${requiredKeys[key]}` });
            return;
        }
    }

    for (const key of ['startLocation', 'destinationLocation']) {
        // check that they are a obj of two numbers
        const value = reqBody[key];
        // check that it is an array
        if (!Array.isArray(value)) {
            res.status(400).json({ error: `${key} must be an array` });
            return;
        } else if (value.length !== 2) {
            res.status(400).json({ error: `${key} must have two elements` });
            return;
        } else if (typeof value[0] !== 'number' || typeof value[1] !== 'number') {
            res.status(400).json({ error: `${key} must be an array of two numbers` });
            return;
        }
    }

    
    let cargoSpecialCharacteristicsValues: cargoSpecialCharacteristics;
    if (reqBody.hasOwnProperty('cargoSpecialCharacteristics')) {
        // check that it is a string
        const value = reqBody['cargoSpecialCharacteristics'];
        if (typeof value !== 'string') {
            res.status(400).json({ error: `cargoSpecialCharacteristics must be of type string` });
            return;
        } else if (value === '') {
            cargoSpecialCharacteristicsValues = "none";
        } else if (!cargoSpecialCharacteristicsArray.includes(value as cargoSpecialCharacteristics)) {
            res.status(400).json({ error: `cargoSpecialCharacteristics must be one of ${cargoSpecialCharacteristicsArray}` });
            return;
        } else {
            cargoSpecialCharacteristicsValues = value as cargoSpecialCharacteristics;
        }
    } else {
        cargoSpecialCharacteristicsValues = "none";
    }

    const options: RideRequest = {
        _id: new ObjectId(),
        requestor: userID,
        startLocation: reqBody.startLocation,
        destinationLocation: reqBody.destinationLocation,
        createdAt: Date.now(),
        status: 'open',
        cargoWeight: reqBody.cargoWeight,
        cargoVolume: reqBody.cargoVolume,
        cargoDescription: reqBody.cargoDescription,
        cargoSpecialCharacteristics: cargoSpecialCharacteristicsValues
    };

    const result = await addRideRequest(options);
    switch (result) {
        case 'error':
            res.status(500).json({ error: 'error adding ride request' });
            break;
        case 'success':
            res.status(200).json({ success: 'ride request added' });
            break;
        default:
            res.status(400).json({ error: result});
            break;
    }
});

module.exports = router;