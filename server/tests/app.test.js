jest.mock('../src/config/database', () => ({
	connect: jest.fn(),
}));

jest.mock('../src/lib/initProductIndex', () => jest.fn().mockResolvedValue());

jest.mock('../src/routes', () => jest.fn());

const request = require('supertest');

const app = require('../src/app');

describe('Server app', () => {
	test('GET /api/health should return healthy status', async () => {
		const response = await request(app).get('/api/health');

		expect(response.status).toBe(200);
		expect(response.body).toEqual({
			status: 'OK',
			message: 'Server is healthy',
		});
	});

	test('GET unknown route should return 404', async () => {
		const response = await request(app).get('/api/not-found');

		expect(response.status).toBe(404);
		expect(response.text).toContain('Cannot GET /api/not-found');
	});

	test('GET /api/health should allow a configured frontend origin', async () => {
		const response = await request(app)
			.get('/api/health')
			.set('Origin', 'http://localhost:4000');

		expect(response.status).toBe(200);
		expect(response.headers['access-control-allow-origin']).toBe('http://localhost:4000');
	});
});
