import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Auth (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('signup sets cookie and /me returns username', async () => {
    const agent = request.agent(app.getHttpServer());
    const seed = Date.now();

    await agent
      .post('/auth/signup')
      .send({
        username: `user${seed}`,
        email: `user${seed}@example.com`,
        password: 'password1234',
      })
      .expect(201);

    const meRes = await agent.get('/me').expect(200);
    expect(meRes.body.username).toBe(`user${seed}`);
  });

  it('login sets cookie and /me returns username', async () => {
    const seed = Date.now() + 1;
    const username = `user${seed}`;
    const email = `user${seed}@example.com`;
    const password = 'password1234';

    // create user first
    await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ username, email, password })
      .expect(201);

    const agent = request.agent(app.getHttpServer());

    await agent
      .post('/auth/login')
      .send({ email, password })
      .expect(201);

    const meRes = await agent.get('/me').expect(200);
    expect(meRes.body.username).toBe(username);
  });

  it('duplicate signup returns 409', async () => {
    const seed = Date.now() + 2;
    const username = `dup${seed}`;
    const email = `dup${seed}@example.com`;

    await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ username, email, password: 'password1234' })
      .expect(201);

    await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ username, email, password: 'password1234' })
      .expect(409);
  });

  it('/me without cookie returns 401', async () => {
    await request(app.getHttpServer()).get('/me').expect(401);
  });
});
