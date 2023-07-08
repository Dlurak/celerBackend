import { Collection, SortDirection } from "mongodb";

/**
 * A function that returns a paginated list of data from a MongoDB collection
 * @param collection The MongoDB collection to get data from
 * @param pageNumber The page number to get data from
 * @param pageSize How many items to get per page
 * @param sortKey What key to sort the data by, defaults to '_id'
 * @param sortOrder In which order to sort the data, defaults to 1
 * @returns Promise<any[]> A promise that resolves to an array of data
 */
export function getPaginatedData(
    collection: Collection,
    pageNumber: number,
    pageSize: number,
    sortKey?: string | '_id',
    sortOrder?: SortDirection
): Promise<any[]> {
    if (pageNumber < 1) throw new Error('pageNumber must be greater than 0');
    if (pageSize < 1) throw new Error('pageSize must be greater than 0');

    const skip = (pageNumber - 1) * pageSize;

    if (!sortKey) {
        sortKey = '_id';
    }
    if (!sortOrder) {
        sortOrder = 1;
    }

    return collection
        .find()
        .sort({ [sortKey]: sortOrder })
        .skip(skip)
        .limit(pageSize)
        .toArray()
}
