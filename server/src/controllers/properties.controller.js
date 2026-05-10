import { getYad2AllProperties } from "../facades/properties.facade.js";
import * as dao from "../models/properties.dao.js";
import { getLatestProperties } from "../jobs/yad2.job.js";
import { Op } from 'sequelize';
import { db } from '../models/index.js';

const numericWhere = (field, op, value) =>
    db.sequelize.where(
        db.sequelize.cast(db.sequelize.col(field), 'NUMERIC'),
        { [op]: value }
    );

const toFloat = (val) => {
    const n = parseFloat(val);
    return isNaN(n) ? null : n;
};

export const listProperties = async (req, res) => {
    const limit = 30;
    const offset = req.query.page ? ((req.query.page - 1) * limit) : 0;
    const {
        neighborhood,
        rooms,
        minMeters, maxMeters,
        minPrice, maxPrice,
        minFloor, maxFloor,
        merchant,
    } = req.query;

    const baseWhere = { userId: req.userId, archived: false, liked: false, call: false, explore: false };
    if (neighborhood) baseWhere.neighborhood = neighborhood;
    if (merchant !== undefined && merchant !== '') baseWhere.merchant = merchant === 'true';

    const numericConditions = [];

    if (toFloat(rooms) !== null) {
        numericConditions.push(numericWhere('rooms', Op.eq, toFloat(rooms)));
    }
    if (toFloat(minMeters) !== null) numericConditions.push(numericWhere('meters', Op.gte, toFloat(minMeters)));
    if (toFloat(maxMeters) !== null) numericConditions.push(numericWhere('meters', Op.lte, toFloat(maxMeters)));
    if (toFloat(minPrice) !== null) {
        numericConditions.push(numericWhere('price', Op.gte, toFloat(minPrice)));
        numericConditions.push(numericWhere('price', Op.gt, 0));
    }
    if (toFloat(maxPrice) !== null) numericConditions.push(numericWhere('price', Op.lte, toFloat(maxPrice)));
    if (toFloat(minFloor) !== null) numericConditions.push(numericWhere('floorNumber', Op.gte, toFloat(minFloor)));
    if (toFloat(maxFloor) !== null) numericConditions.push(numericWhere('floorNumber', Op.lte, toFloat(maxFloor)));

    const query = {
        where: numericConditions.length > 0
            ? { ...baseWhere, [Op.and]: numericConditions }
            : baseWhere,
        order: [['propertyDateAdded', 'DESC']],
        limit,
        offset,
    };

    const response = await dao.listProperties(query);
    res.send(response);
};

export const queryProperties = async (req, res) => {
    const query = req.body.query;
    query.where = { ...query.where, userId: req.userId };
    const response = await dao.listProperties(query);
    res.send(response);
};

export const updateProperty = async (req, res) => {
    const id = req.params.id;
    const fields = req.body.fields;
    const data = req.body.data;

    const dataToUpdate = fields.reduce((acc, field) => {
        return { ...acc, [field]: data[field] };
    }, {});
    const message = await dao.updateProperty(id, req.userId, dataToUpdate);
    res.send(message);
};

export const initProperties = async (req, res) => {
    const { properties } = await getYad2AllProperties();
    await dao.bulkCreateProperties(properties, req.userId);
    res.send({ message: `${properties.length} properties synced.` });
};

export const syncProperties = async (req, res) => {
    const { properties } = await getLatestProperties(req.userId);
    res.send({ properties });
};
