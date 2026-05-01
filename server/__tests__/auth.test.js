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
import { db } from '../src/models/index.js';
import { verifyGoogleToken } from '../src/authentication/authentication.client.js';

beforeEach(() => jest.clearAllMocks());

describe('POST /signup', () => {
    it('returns 400 when the Google token is invalid', async () => {
        verifyGoogleToken.mockResolvedValue({ error: 'Invalid token' });

        const res = await request(app).post('/signup').send({ credential: 'bad-token' });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Invalid token');
    });

    it('creates user and returns it when credential is valid', async () => {
        verifyGoogleToken.mockResolvedValue({
            payload: { name: 'John Doe', given_name: 'John', family_name: 'Doe', picture: 'http://pic', email: 'john@example.com' },
        });
        const createdUser = { id: 1, email: 'john@example.com' };
        db.users.create.mockResolvedValue(createdUser);

        const res = await request(app).post('/signup').send({ credential: 'valid-token' });
        expect(res.status).toBe(200);
        expect(res.body.user).toEqual(createdUser);
        expect(db.users.create).toHaveBeenCalledWith(
            expect.objectContaining({ email: 'john@example.com', fullName: 'John Doe' })
        );
    });

    it('returns 500 when user creation fails', async () => {
        verifyGoogleToken.mockResolvedValue({
            payload: { name: 'John', email: 'john@example.com' },
        });
        db.users.create.mockRejectedValue(new Error('DB error'));

        const res = await request(app).post('/signup').send({ credential: 'valid-token' });
        expect(res.status).toBe(500);
    });
});

describe('POST /login', () => {
    it('returns 400 when the Google token is invalid', async () => {
        verifyGoogleToken.mockResolvedValue({ error: 'Token expired' });

        const res = await request(app).post('/login').send({ credential: 'bad-token' });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Token expired');
    });

    it('returns the found user when credential is valid', async () => {
        verifyGoogleToken.mockResolvedValue({ payload: { email: 'john@example.com' } });
        const foundUser = { id: 1, email: 'john@example.com' };
        db.users.findOne.mockResolvedValue(foundUser);

        const res = await request(app).post('/login').send({ credential: 'valid-token' });
        expect(res.status).toBe(200);
        expect(res.body.user).toEqual(foundUser);
        expect(db.users.findOne).toHaveBeenCalledWith(
            expect.objectContaining({ where: { email: 'john@example.com' } })
        );
    });
});
