import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository"
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository"
import { ICreateUserDTO } from "@modules/users/useCases/createUser/ICreateUserDTO"
import { hash } from "bcryptjs"
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO"
import { GetStatementOperationError } from "./GetStatementOperationError"
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase"


let repository: InMemoryStatementsRepository
let userRepository: InMemoryUsersRepository
let getStatementOperationUseCase: GetStatementOperationUseCase

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Get statement", () => {
  beforeEach(() => {
    repository = new InMemoryStatementsRepository()
    userRepository = new InMemoryUsersRepository()
    getStatementOperationUseCase = new GetStatementOperationUseCase(userRepository, repository)
  })

  it("Shouldbe able to get statement by user id",
    async () => {
      const passwordHash = await hash("test", 8);

      const userToSave: ICreateUserDTO = {
        email: 'vitor@test.com', name: "vitor", password: passwordHash
      }
      const user = await userRepository.create({ email: userToSave.email, name: userToSave.name, password: userToSave.password, })

      const save: ICreateStatementDTO = {
        amount: 1000,
        description: "amount test",
        type: "deposit" as OperationType,
        user_id: user.id as string
      }

      const statement = await repository.create(save)

      const response = await getStatementOperationUseCase.execute({ user_id: user.id as string, statement_id: statement.id as string })

      expect(response).toHaveProperty("id")
      expect(response.amount).toEqual(1000)
      expect(response.id).toEqual(statement.id)
    })

  it("Should be not able to get statement by user and statement id", async () => {
    const passwordHash = await hash("test", 8);

    const userToSave: ICreateUserDTO = {
      email: 'vitor@test.com', name: "vitor", password: passwordHash
    }
    const user = await userRepository.create({ email: userToSave.email, name: userToSave.name, password: userToSave.password, })

    const save: ICreateStatementDTO = {
      amount: 1000,
      description: "amount test",
      type: "deposit" as OperationType,
      user_id: user.id as string
    }

    const statement = await repository.create(save)

    const response = await getStatementOperationUseCase.execute({ user_id: user.id as string, statement_id: statement.id as string })

    expect(response).toHaveProperty("id")
    expect(response.amount).toEqual(1000)
    expect(response.id).toEqual(statement.id)
  })

  it("Should not be able to get statement by user and statement id if user does not exists",
    async () => {
      expect(async () => {
        const passwordHash = await hash("test", 8);

        const userToSave: ICreateUserDTO = {
          email: 'vitor@test.com', name: "vitor", password: passwordHash
        }
        const user = await userRepository.create({ email: userToSave.email, name: userToSave.name, password: userToSave.password, })

        const save: ICreateStatementDTO = {
          amount: 1000,
          description: "amount test",
          type: "deposit" as OperationType,
          user_id: user.id as string
        }

        const statement = await repository.create(save)

        await getStatementOperationUseCase.execute({ user_id: "wrong id", statement_id: statement.id as string })
      }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound)
    })

  it("Should not be able to get statement by user and statement id if statement does not exists",
    async () => {
      expect(async () => {
        const passwordHash = await hash("test", 8);

        const userToSave: ICreateUserDTO = {
          email: 'vitor@test.com', name: "vitor", password: passwordHash
        }
        const user = await userRepository.create({ email: userToSave.email, name: userToSave.name, password: userToSave.password, })

        const save: ICreateStatementDTO = {
          amount: 1000,
          description: "amount test",
          type: "deposit" as OperationType,
          user_id: user.id as string
        }

        const statement = await repository.create(save)

        await getStatementOperationUseCase.execute({ user_id: save.user_id as string, statement_id: "wrong statement id" })
      }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound)
    })

})
