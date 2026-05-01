import request from 'supertest';

jest.mock('../src/models/index.js', () => ({
    db: {
        users: { create: jest.fn(), findOne: jest.fn() },
        properties: { findAndCountAll: jest.fn(), bulkCreate: jest.fn(), update: jest.fn(), max: jest.fn() },
        sequelize: { sync: jest.fn().mockResolvedValue() },
    },
}));
jest.mock('../src/jobs/yad2.job.js', () => ({ initScheduledJobs: jest.fn(), getLatestProperties: jest.fn() }));
jest.mock('../src/queues/properies.queues.js', () => ({ producePagesToQueue: jest.fn() }));
jest.mock('../src/facades/properties.facade.js', () => ({ getYad2Page: jest.fn() }));
jest.mock('../src/authentication/authentication.client.js', () => ({ verifyGoogleToken: jest.fn() }));

import app from '../app.js';

describe('GET /health', () => {
    it('returns 200 with status ok', async () => {
        const res = await request(app).get('/health');
        expect(res.status).toBe(200);
        expect(res.body.status).toBe('ok');
    });

    it('returns a timestamp', async () => {
        const before = Date.now();
        const res = await request(app).get('/health');
        const after = Date.now();
        const ts = new Date(res.body.timestamp).getTime();
        expect(ts).toBeGreaterThanOrEqual(before);
        expect(ts).toBeLessThanOrEqual(after);
    });
});
