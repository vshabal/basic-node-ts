import request from 'supertest';
import { App } from '../src/App';
import { boot } from '../src/main';

let app: App;

beforeAll(async () => {
  const { app: application } = await boot;
  app = application;
});

describe('Users', () => {
  it('returns register error', async () => {
    const response = await request(app.app)
      .post('/users/register')
      .send({ email: 'test@test.com', password: '1' });

    expect(response.statusCode).toBe(422);
  });
});

afterAll(() => {
  app.close();
});
