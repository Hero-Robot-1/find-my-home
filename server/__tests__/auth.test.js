import request from 'supertest';

jest.mock('../src/models/index.js', () => ({
    db: {
        users: { create: jest.fn(), findOne: jest.fn(), findOrCreate: jest.fn() },
        properties: { findAndCountAll: jest.fn(), bulkCreate: jest.fn(), update: jest.fn(), max: jest.fn() },
        sequelize: { sync: jest.fn().mockResolvedValue() },
    },
}));
jest.mock('../src/jobs/yad2.job.js', () => ({ initScheduledJobs: jest.fn(), getLatestProperties: jest.fn() }));
jest.mock('../src/queues/properies.queues.js', () => ({ producePagesToQueue: jest.fn() }));
jest.mock('../src/facades/properties.facade.js', () => ({ getYad2Page: jest.fn() }));
jest.mock('../src/authentication/authentication.client.js', () => ({ verifyGoogleToken: jest.fn() }));

import app from '../app.js';
import { db } from '../src/models/index.js';
import { verifyGoogleToken } from '../src/authentication/authentication.client.js';

beforeEach(() => jest.clearAllMocks());

describe('POST /login', () => {
    it('returns 400 when the Google token is invalid', async () => {
        verifyGoogleToken.mockResolvedValue({ error: 'Token expired' });

        const res = await request(app).post('/login').send({ credential: 'bad-token' });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Token expired');
    });

    it('returns 400 when credential is missing', async () => {
        const res = await request(app).post('/login').send({});
        expect(res.status).toBe(400);
    });

    it('creates and returns user on first login', async () => {
        verifyGoogleToken.mockResolvedValue({
            payload: { name: 'John Doe', given_name: 'John', family_name: 'Doe', picture: 'http://pic', email: 'john@example.com' },
        });
        const user = { id: 1, email: 'john@example.com' };
        db.users.findOrCreate.mockResolvedValue([user, true]);

        const res = await request(app).post('/login').send({ credential: 'valid-token' });
        expect(res.status).toBe(200);
        expect(res.body.user).toEqual(user);
        expect(db.users.findOrCreate).toHaveBeenCalledWith(
            expect.objectContaining({ where: { email: 'john@example.com' } })
        );
    });

    it('returns existing user on subsequent logins', async () => {
        verifyGoogleToken.mockResolvedValue({
            payload: { name: 'John Doe', given_name: 'John', family_name: 'Doe', picture: 'http://pic', email: 'john@example.com' },
        });
        const user = { id: 1, email: 'john@example.com' };
        db.users.findOrCreate.mockResolvedValue([user, false]);

        const res = await request(app).post('/login').send({ credential: 'valid-token' });
        expect(res.status).toBe(200);
        expect(res.body.user).toEqual(user);
    });
});
