import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { ICreateUserDTO } from "@modules/users/useCases/createUser/ICreateUserDTO";
import { hash } from "bcryptjs";
import { stringify } from "uuid";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { ICreateStatementDTO } from "./ICreateStatementDTO";

let createStatementUseCase: CreateStatementUseCase
let repository: InMemoryStatementsRepository
let userRepository: InMemoryUsersRepository
enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Create statemnt", () => {
  beforeEach(() => {
    repository = new InMemoryStatementsRepository()
    userRepository = new InMemoryUsersRepository()
    createStatementUseCase = new CreateStatementUseCase(userRepository, repository)
  })

  it("Should be able to create a statement", async () => {
    const passwordHash = await hash("test", 8);

    const userToSave: ICreateUserDTO = {
      email: 'vitor@test.com', name: "vitor", password: passwordHash
    }
    const user = await userRepository.create({ email: userToSave.email, name: userToSave.name, password: userToSave.password, })

    const save: ICreateStatementDTO = {
      amount: 1000,
      description: "amount test",
      type: "DEPOSIT" as OperationType,
      user_id: user.id as string
    }

    const statemenent = await createStatementUseCase.execute(save)
    expect(statemenent).toHaveProperty('id')
    expect(statemenent.user_id).toEqual(user.id)
  })

  it("Should not be able to create a statement without a valdiad user ", async () => {
    expect(async () => {
      const passwordHash = await hash("test", 8);

      const userToSave: ICreateUserDTO = {
        email: 'vitor@test.com', name: "vitor", password: passwordHash
      }
      const user = await userRepository.create({ email: userToSave.email, name: userToSave.name, password: userToSave.password, })

      const save: ICreateStatementDTO = {
        amount: 1000,
        description: "amount test",
        type: "DEPOSIT" as OperationType,
        user_id: "id"
      }

      await createStatementUseCase.execute(save)
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound)
  })


  it("Should not be able to create a statement if the balance is lower than the withdraw ", async () => {
    expect(async () => {
      const passwordHash = await hash("test", 8);

      const userToSave: ICreateUserDTO = {
        email: 'vitor@test.com', name: "vitor", password: passwordHash
      }
      const user = await userRepository.create({ email: userToSave.email, name: userToSave.name, password: userToSave.password, })

      const save: ICreateStatementDTO = {
        amount: 1000,
        description: "amount test",
        type: "DEPOSIT" as OperationType,
        user_id: user.id as string
      }

      await createStatementUseCase.execute(save)

      await createStatementUseCase.execute({
        amount: 1500,
        description: "amount test",
        type: "withdraw" as OperationType,
        user_id: user.id as string
      })
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds)
  })
})
