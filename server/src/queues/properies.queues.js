import Queue from "bull";
import {getYad2Page} from "../facades/properties.facade.js";
import * as dao from "../models/properties.dao.js";

const jobQueue = new Queue('create-properties-queues');
export const producePagesToQueue = async (pages = 1 ,
                                          startDate = null ,
                                          endDate = Date.now()) => {
    for (let i = 2; i <= pages; i++) {
        let job = await jobQueue.add({ pageNumber: i, startDate, endDate });
        console.log(`Job ${job.data?.pageNumber} added to the queue.`);
    }
}

jobQueue.process(async (job) => {
    console.log(`Processing job ${job} with data: ${JSON.stringify(job.data)}`);
    setTimeout(() => {}, 5000);
    const currentPage = await getYad2Page(job.data?.pageNumber, job.data?.startDate, job.data?.endDate);
    await dao.bulkCreateProperties(currentPage.properties);
    console.log(`Job ${job.data?.pageNumber} completed.`);
});