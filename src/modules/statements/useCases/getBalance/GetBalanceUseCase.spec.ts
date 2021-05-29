import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { ICreateStatementDTO } from "@modules/statements/useCases/createStatement/ICreateStatementDTO";
import { GetBalanceError } from "@modules/statements/useCases/getBalance/GetBalanceError";
import { GetBalanceUseCase } from "@modules/statements/useCases/getBalance/GetBalanceUseCase";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { ICreateUserDTO } from "@modules/users/useCases/createUser/ICreateUserDTO";
import { hash } from "bcryptjs";


let getBalanceUseCase: GetBalanceUseCase
let repository: InMemoryStatementsRepository
let userRepository: InMemoryUsersRepository


enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe('get balance', () => {
  beforeEach(() => {
    repository = new InMemoryStatementsRepository()
    userRepository = new InMemoryUsersRepository()
    getBalanceUseCase = new GetBalanceUseCase(repository, userRepository)
  })


  it("Should be able to get balance by user id", async () => {
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
    repository.create(save)

    const total = await getBalanceUseCase.execute({ user_id: user.id as string })
    expect(total.balance).toEqual(1000)
  })

  it("Should not be able to get balance by user id if user does not exist", async () => {
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
        user_id: "user.id as string"
      }
      repository.create(save)

      await getBalanceUseCase.execute({ user_id: save.user_id })
    }).rejects.toBeInstanceOf(GetBalanceError)
  })

})
