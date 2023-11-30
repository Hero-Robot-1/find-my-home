import { getYad2Page } from "../facades/properties.facade.js";
import * as dao from "../models/properties.dao.js";
import { producePagesToQueue } from "../queues/properies.queues.js";
import { getLatestProperties } from "../jobs/yad2.job.js";

export const listProperties = async (req, res) => {
    const limit = 30
    const offset = req.query.page ? ((req.query.page - 1) * limit) : 0
    const neighborhood = req.query.neighborhood
    let query = {
        where: { archived: false, liked: false, call: false, explore: false, },
        order: [['propertyDateAdded', 'DESC']],
        limit,
        offset
    }
    if (!!neighborhood) {
        query.where = { ...query.where, neighborhood }
    }
    const response = await dao.listProperties(query);

    res.send(response);
}

export const queryProperties = async (req, res) => {
    const query = req.body.query;
    const response = await dao.listProperties(query);
    res.send(response);
}

export const updateProperty = async (req, res) => {
    const id = req.params.id;
    const fields = req.body.fields;
    const data = req.body.data;

    const dataToUpdate = fields.reduce((acc, field) => {
        const fieldValue = data[field];
        return { ...acc, [field]: fieldValue };
    }, {});
    const message = await dao.updateProperty(id, dataToUpdate);
    res.send(message);
}

export const initProperties = async (req, res) => {
    const yad2Page = await getYad2Page(1);
    await dao.bulkCreateProperties(yad2Page.properties);
    await producePagesToQueue(yad2Page.pagination?.last_page || 1)
    res.send({
        message: `${ yad2Page.pagination?.last_page } Jobs were produced.`
    })
};

export const syncProperties = async (req, res) => {
    const { properties } = await getLatestProperties();
    res.send({
        properties
    })
};
