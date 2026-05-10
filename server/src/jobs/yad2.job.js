import cron from 'node-cron';
import { getYad2AllProperties } from "../facades/properties.facade.js";
import * as dao from "../models/properties.dao.js";
import { db } from "../models/index.js";

export async function getLatestProperties(userId) {
    const { properties } = await getYad2AllProperties();
    await dao.bulkCreateProperties(properties, userId);
    return { properties };
}

export const initScheduledJobs = () => {
    const scheduledJobFunction = cron.schedule("59 23 * * *", async () => {
        console.log("Running nightly sync for all users...");
        const users = await db.users.findAll({ attributes: ['id'] });
        await Promise.all(users.map(u => getLatestProperties(u.id)));
    });
    scheduledJobFunction.start();
};
