import {db} from '../models/index.js';
import {getYad2Page} from "../facades/properties.facade.js";
import * as dao from "../models/properties.dao.js";
import {producePagesToQueue} from "../queues/properies.queues.js";

const Property = db.properties;

export const listProperties = () => dao.listProperties();

export const createProperty = () => dao.createProperty();

export const updateProperty = () => dao.updateProperty();

export const syncProperties = async (req, res) => {
    const yad2Page = await getYad2Page(1);
    await dao.bulkCreateProperties(yad2Page.properties);
    await producePagesToQueue(yad2Page.pagination?.last_page || 1)
    res.send({
        message: `${yad2Page.pagination?.last_page} Jobs were produced.`
    })
};
