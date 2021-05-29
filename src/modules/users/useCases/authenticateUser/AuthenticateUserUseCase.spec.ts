import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"
import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository'
import { ICreateUserDTO } from "../createUser/ICreateUserDTO"
import { hash } from "bcryptjs"
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError"

let authUserUseCase: AuthenticateUserUseCase
let repository: InMemoryUsersRepository
describe("Authenticate user", () => {

  beforeEach(() => {
    repository = new InMemoryUsersRepository()
    authUserUseCase = new AuthenticateUserUseCase(repository)
  })

  it("Should be able to authenticate an user", async () => {
    const passwordHash = await hash("test", 8);

    const userToSave: ICreateUserDTO = {
      email: 'vitor@test.com', name: "vitor", password: passwordHash
    }
    const user = await repository.create(userToSave)

    const auth = await authUserUseCase.execute({ email: userToSave.email, password: "test" })

    expect(auth).toHaveProperty("token")
  })

  it("Should be able to authenticate an user", async () => {
    const passwordHash = await hash("test", 8);

    const userToSave: ICreateUserDTO = {
      email: 'vitor@test.com', name: "vitor", password: passwordHash
    }
    const user = await repository.create(userToSave)

    const auth = await authUserUseCase.execute({ email: userToSave.email, password: "test" })

    expect(auth).toHaveProperty("token")
  })

  it("Should not be able to authenticate an user with inexistent email", async () => {
    expect(async () => {
      const passwordHash = await hash("test", 8);

      const userToSave: ICreateUserDTO = {
        email: 'vitor@test.com', name: "vitor", password: passwordHash
      }
      const user = await repository.create(userToSave)

      await authUserUseCase.execute({ email: "Email errado", password: "test" })
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })

  it("Should not be able to authenticate an user with worong password", async () => {
    expect(async () => {
      const passwordHash = await hash("test", 8);

      const userToSave: ICreateUserDTO = {
        email: 'vitor@test.com', name: "vitor", password: passwordHash
      }
      const user = await repository.create(userToSave)

      await authUserUseCase.execute({ email: "Email errado", password: "test" })
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })
})
