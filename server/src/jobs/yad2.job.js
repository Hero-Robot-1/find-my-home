import cron from 'node-cron';
import { getLatestPropertyUpdatedDate } from "../models/properties.dao.js";
import { producePagesToQueue } from "../queues/properies.queues.js";
import { getYad2Page } from "../facades/properties.facade.js";
import * as dao from "../models/properties.dao.js";

export const initScheduledJobs = () => {
    const scheduledJobFunction = cron.schedule("59 23 * * *", async () => {
        console.log("I'm executed on a schedule!");
        const { lastDateUpdated } = await getLatestPropertyUpdatedDate();
        const lateDateUpdatedInMillis = new Date(lastDateUpdated).getTime()
        const currentTimeInMillis = Date.now();
        const yad2Page = await getYad2Page(1, lateDateUpdatedInMillis, currentTimeInMillis);
        await dao.bulkCreateProperties(yad2Page.properties);
        await producePagesToQueue(yad2Page.pagination?.last_page || 1, lateDateUpdatedInMillis, currentTimeInMillis)
    });

    scheduledJobFunction.start();
}