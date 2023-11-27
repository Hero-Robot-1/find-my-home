import { db } from './index.js';

const Property = db.properties;

export const listProperties = async (query) => {
    return Property.findAndCountAll(query)
        .then(data => {
            return {
                properties: data.rows,
                pagination: {
                    limit: query.limit,
                    offset: query.offset,
                    count: data.count
                }
            };
        })
        .catch(err => {
            throw new Error(JSON.stringify(err.message));
        });
};

export const bulkCreateProperties = async (properties) => {
    return Property.bulkCreate(properties, { returning: true, ignoreDuplicates: true })
        .then(data => {
            return {
                properties: data
            };
        })
        .catch(err => {
            throw new Error(JSON.stringify(err.message));
        });
};

export const updateProperty = async (id, dataToUpdate) => {
    return Property.update(dataToUpdate, {
        where: { propertyId: id },
    })
        .then(num => {
            if (num == 1) {
                return {
                    message: "Property was updated successfully."
                };
            } else {
                return {
                    message: `Cannot update Property with id=${ id }`
                };
            }
        })
        .catch(err => {
            throw new Error(JSON.stringify(err.message));
        });
};

export const getLatestPropertyUpdatedDate = async () => {
    return Property.max('propertyDateAdded', {})
        .then(value => {
            return {
                lastDateUpdated: value
            };
        })
        .catch(err => {
            throw new Error(JSON.stringify(err.message));
        });
};
