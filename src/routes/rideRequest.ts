import express, { Request, Response } from 'express';
import authenticate from '../middleware/auth';
import { addRideRequest, getAllRideRequests } from '../database/rideRequest';
import { findUsers } from '../database/users';
import { db } from '../database/database';
import { ObjectId } from 'mongodb';
import { RideRequest, cargoSpecialCharacteristics, cargoSpecialCharacteristicsArray } from '../interfaces/rideRequest';
import { getPaginatedData } from '../database/pagination';


const router = express.Router();

router.use(authenticate);


router.route('/')
    .get(async (req: Request, res: Response) => {
        const params = req.query;
        const requiredKeys: {
            [key: string]: "string" | "number"
        } = {
            'page': 'number',
            'pageSize': 'number'
        };

        Object.entries(requiredKeys).forEach(entry => {
            const key = entry[0];
            const type = entry[1];
            const value = params[key] as string;
            const valueParsedInt = parseInt(value);

            if (!params.hasOwnProperty(key)) {
                res.status(400).json({ error: `missing ${key}` });
                return;
            } else if (isNaN(valueParsedInt) && type === 'number') {
                res.status(400).json({ error: `${key} must be of type ${type}` });
                return;
            }
        });

        const page = parseInt(params.page as string);
        const pageSize = parseInt(params.pageSize as string);
        const collection = db.collection('requestedRides');

        const paginatedData = await getPaginatedData(collection, page, pageSize);

        res.status(502).json(paginatedData);
    })
    .post(async (req: Request, res: Response) => {
        const reqBody = req.body;
        const userID = (await findUsers({ username: res.locals.jwtPayload.username }, db))[0]._id;


        const requiredKeys: { [key: string]: "string" | "object" | "number" } = {
            'startLocation': 'object', // sadly arrays are objects in js
            'destinationLocation': 'object',
            'cargoWeight': 'number',
            'cargoVolume': 'number',
            'cargoDescription': 'string',
            'title': 'string'
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


        let cargoSpecialCharacteristicsValues: cargoSpecialCharacteristics[];

        if (reqBody.hasOwnProperty('cargoSpecialCharacteristics')) {
            const value = reqBody['cargoSpecialCharacteristics'];
            if (!Array.isArray(value)) {
                res.status(400).json({ error: `cargoSpecialCharacteristics must be an array` });
                return;
            }
            for (const characteristic of value) {
                if (!cargoSpecialCharacteristicsArray.includes(characteristic)) {
                    res.status(400).json({ error: `"${characteristic}" is not a valid cargoSpecialCharacteristic` });
                    return;
                }
            }
            cargoSpecialCharacteristicsValues = value.filter((item: cargoSpecialCharacteristics, index: number) => value.indexOf(item) === index);
        } else {
            cargoSpecialCharacteristicsValues = ["none"];
        }

        const options: RideRequest = {
            _id: new ObjectId(),
            requestor: userID,
            startLocation: reqBody.startLocation,
            destinationLocation: reqBody.destinationLocation,
            createdAt: Date.now(),
            status: 'open',
            title: reqBody.title,
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
                res.status(201).json({ success: 'ride request added' });
                break;
            default:
                res.status(400).json({ error: result });
                break;
        }
    })
    .all((req: Request, res: Response) => {
        res.status(405).json({ error: "method not allowed" });
    });


router.route('/all')
    .get(async (req: Request, res: Response) => {
        res.status(200).json(await getAllRideRequests());
    })
    .all((req: Request, res: Response) => {
        res.status(405).json({ error: "method not allowed" });
    });


module.exports = router;