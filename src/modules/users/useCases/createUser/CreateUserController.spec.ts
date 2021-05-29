import request from 'supertest';
import { Connection } from "typeorm";
import { app } from '../../../../app';
import createConnection from '../../../../database/index';

let connection: Connection

describe("Create user", () => {
  beforeAll(async () => {
    connection = await createConnection()
    await connection.runMigrations()
  })

  afterAll(async () => {
    await connection.dropDatabase()
    await connection.close()
  })

  it("Should be able to create an user", async () => {
    const response = await request(app).post('/api/v1/users').send({
      name: "admin",
      email: "admin@admdasin.com.br",
      password: "admin"
    })
    expect(response.statusCode).toBe(201)
  })

  it("Should not be able to create an user with same email twice", async () => {

    await request(app).post('/api/v1/users').send({
      name: "admin",
      email: "vitor@admin.com.br",
      password: "admin"
    })

    const response = await request(app).post('/api/v1/users').send({
      name: "vitor",
      email: "vitor@admin.com.br",
      password: "xxx"
    })

    expect(response.statusCode).toBe(400)
  })
})
