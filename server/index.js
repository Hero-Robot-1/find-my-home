import app from './app.js';
import { db } from './src/models/index.js';
import * as cron from './src/jobs/yad2.job.js';

db.sequelize.sync()
    .then(() => {
        console.log("Synced db.");
    })
    .catch((err) => {
        console.log("Failed to sync db: " + err.message);
    });

cron.initScheduledJobs();

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server listening on ${ PORT }`);
});
