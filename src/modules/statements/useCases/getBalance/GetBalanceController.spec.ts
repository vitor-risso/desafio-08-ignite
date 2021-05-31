import { app } from '../../../../app';
import { hash } from 'bcryptjs';
import createConnection from '../../../../database/index';
import request from 'supertest';
import { Connection } from "typeorm";
import { v4 as uuid } from 'uuid';

let connection: Connection
let user_id: string

describe("Get balance", () => {
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
    user_id = id
  })

  afterAll(async () => {
    await connection.dropDatabase()
    await connection.close()
  })

  it("Should be able to get balance", async () => {
    const responseToken = await request(app).post('/api/v1/sessions').send({
      email: "admin@admin.com.br",
      password: "admin"
    })

    const { token } = responseToken.body

    await request(app).post('/api/v1/statements/deposit').send({
      amount: 10,
      description: "Test"
    }).set({
      Authorization: `Baerer ${token}`
    })

    const response = await request(app).get('/api/v1/statements/balance').set({
      Authorization: `Baerer ${token}`
    })

    expect(response.statusCode).toEqual(200)
    expect(response.body.statement.length).toEqual(1)
    expect(response.body.statement[0].type).toEqual("deposit")

  })

})
