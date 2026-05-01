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
jest.mock('../src/models/properties.dao.js', () => ({
    listProperties: jest.fn(),
    bulkCreateProperties: jest.fn(),
    updateProperty: jest.fn(),
    getLatestPropertyUpdatedDate: jest.fn(),
}));

import app from '../app.js';
import * as dao from '../src/models/properties.dao.js';

const mockProperties = [
    { propertyId: '1', title: 'Test Property', price: '5000', neighborhood: 'Tel Aviv', archived: false },
];

const mockPagination = { limit: 30, offset: 0, count: 1 };

beforeEach(() => jest.clearAllMocks());

describe('GET /properties', () => {
    it('returns 200 with properties and pagination', async () => {
        dao.listProperties.mockResolvedValue({ properties: mockProperties, pagination: mockPagination });

        const res = await request(app).get('/properties');
        expect(res.status).toBe(200);
        expect(res.body.properties).toEqual(mockProperties);
        expect(res.body.pagination.count).toBe(1);
    });

    it('defaults to offset 0 with no page param', async () => {
        dao.listProperties.mockResolvedValue({ properties: [], pagination: mockPagination });

        await request(app).get('/properties');
        expect(dao.listProperties).toHaveBeenCalledWith(
            expect.objectContaining({ offset: 0, limit: 30 })
        );
    });

    it('calculates offset from page query param', async () => {
        dao.listProperties.mockResolvedValue({ properties: [], pagination: { ...mockPagination, offset: 30 } });

        await request(app).get('/properties?page=2');
        expect(dao.listProperties).toHaveBeenCalledWith(
            expect.objectContaining({ offset: 30 })
        );
    });

    it('filters by neighborhood when provided', async () => {
        dao.listProperties.mockResolvedValue({ properties: [], pagination: mockPagination });

        await request(app).get('/properties?neighborhood=Florentin');
        expect(dao.listProperties).toHaveBeenCalledWith(
            expect.objectContaining({ where: expect.objectContaining({ neighborhood: 'Florentin' }) })
        );
    });

    it('excludes archived, liked, call, and explore properties by default', async () => {
        dao.listProperties.mockResolvedValue({ properties: [], pagination: mockPagination });

        await request(app).get('/properties');
        expect(dao.listProperties).toHaveBeenCalledWith(
            expect.objectContaining({
                where: expect.objectContaining({ archived: false, liked: false, call: false, explore: false }),
            })
        );
    });
});

describe('POST /properties/query', () => {
    it('returns 200 with results matching the provided query', async () => {
        dao.listProperties.mockResolvedValue({ properties: mockProperties, pagination: mockPagination });

        const query = { where: { liked: true }, limit: 10, offset: 0 };
        const res = await request(app).post('/properties/query').send({ query });
        expect(res.status).toBe(200);
        expect(res.body.properties).toEqual(mockProperties);
        expect(dao.listProperties).toHaveBeenCalledWith(query);
    });

    it('returns empty list when no properties match', async () => {
        dao.listProperties.mockResolvedValue({ properties: [], pagination: { limit: 10, offset: 0, count: 0 } });

        const res = await request(app).post('/properties/query').send({ query: { where: { liked: true } } });
        expect(res.status).toBe(200);
        expect(res.body.properties).toHaveLength(0);
    });
});
