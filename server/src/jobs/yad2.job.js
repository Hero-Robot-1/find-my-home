import cron from 'node-cron';
import { getYad2AllProperties } from "../facades/properties.facade.js";
import * as dao from "../models/properties.dao.js";

export async function getLatestProperties() {
    const { properties } = await getYad2AllProperties();
    await dao.bulkCreateProperties(properties);
    return { properties };
}

export const initScheduledJobs = () => {
    const scheduledJobFunction = cron.schedule("59 23 * * *", async () => {
        console.log("Running nightly sync...");
        await getLatestProperties();
    });
    scheduledJobFunction.start();
};
