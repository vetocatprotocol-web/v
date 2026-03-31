import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Tasks (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let workspaceId: string;
  let taskId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Register and login to get token
    const registerResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: `task-test-${Date.now()}@example.com`,
        password: 'password123',
        name: 'Task Test User',
      });

    authToken = registerResponse.body.access_token;

    // Create a workspace for the user
    const workspaceResponse = await request(app.getHttpServer())
      .post('/workspaces')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'Test Workspace',
      });

    workspaceId = workspaceResponse.body.id;
  });

  it('/tasks (POST) - should create a new task', () => {
    return request(app.getHttpServer())
      .post('/tasks')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        workspaceId,
        title: 'Test Task',
        description: 'This is a test task',
        type: 'manual',
        priority: 'medium',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('id');
        expect(res.body.title).toBe('Test Task');
        expect(res.body.status).toBe('pending');
        taskId = res.body.id;
      });
  });

  it('/tasks (GET) - should retrieve tasks for workspace', () => {
    return request(app.getHttpServer())
      .get(`/tasks?workspaceId=${workspaceId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
        const task = res.body.find((t: any) => t.id === taskId);
        expect(task).toBeDefined();
        expect(task.title).toBe('Test Task');
      });
  });

  it('/tasks/:id/execute (POST) - should execute a task', () => {
    return request(app.getHttpServer())
      .post(`/tasks/${taskId}/execute`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);
  });

  it('/tasks/:id (GET) - should retrieve specific task', () => {
    return request(app.getHttpServer())
      .get(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.id).toBe(taskId);
        expect(res.body.title).toBe('Test Task');
      });
  });

  afterAll(async () => {
    await app.close();
  });
});