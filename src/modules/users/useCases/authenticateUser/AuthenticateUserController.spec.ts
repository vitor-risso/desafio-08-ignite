import { app } from '../../../../app';
import { hash } from 'bcryptjs';
import createConnection from '../../../../database/index';
import request from 'supertest';
import { Connection } from "typeorm";
import { v4 as uuid } from 'uuid';

let connection: Connection

describe("Authenticate user", () => {
  beforeAll(async () => {
    connection = await createConnection()
    await connection.runMigrations()
    const id = uuid()
    const password = await hash("admin", 8)

    await connection.query(
      `INSERT INTO USERS(id, name, email, password, created_at)
    values('${id}', 'admin', 'admin@admin.com.br','${password}' , 'now()')
    `
    )
  })

  afterAll(async () => {
    await connection.dropDatabase()
    await connection.close()
  })

  it("Should be able to authenticade an user", async () => {
    const response = await request(app).post('/api/v1/sessions').send({
      email: "admin@admin.com.br",
      password: "admin"
    })

    expect(response.statusCode).toBe(200)
  })

  it("Should not be able to authenticade an user with wrong password", async () => {
    const response = await request(app).post('/api/v1/sessions').send({
      email: "admin@admin.com.br",
      password: "adminn"
    })

    expect(response.statusCode).toBe(401)
  })

  it("Should not be able to authenticade an user with wrong email", async () => {
    const response = await request(app).post('/api/v1/sessions').send({
      email: "admin@admin.com.sbr",
      password: "admin"
    })

    expect(response.statusCode).toBe(401)
  })
})
