import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Auth (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/register (POST) - should register a new user', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: `test-${Date.now()}@example.com`,
        password: 'password123',
        name: 'Test User',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('access_token');
        expect(res.body).toHaveProperty('user');
      });
  });

  it('/auth/login (POST) - should login existing user', async () => {
    const email = `login-test-${Date.now()}@example.com`;
    
    // First register
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email,
        password: 'password123',
        name: 'Login Test User',
      });

    // Then login
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email,
        password: 'password123',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('access_token');
        expect(res.body).toHaveProperty('user');
      });
  });

  it('/auth/login (POST) - should fail with wrong password', async () => {
    const email = `wrong-pass-${Date.now()}@example.com`;
    
    // First register
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email,
        password: 'password123',
        name: 'Wrong Pass User',
      });

    // Try login with wrong password
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email,
        password: 'wrongpassword',
      })
      .expect(401);
  });

  afterAll(async () => {
    await app.close();
  });
});