import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserError } from "./CreateUserError"
import { CreateUserUseCase } from "./CreateUserUseCase"
import { ICreateUserDTO } from "./ICreateUserDTO"


let createUserUseCase: CreateUserUseCase
let repository: InMemoryUsersRepository
describe("Create user", () => {


  beforeEach(() => {
    repository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(repository)
  })

  it("Should be able to create an user", async () => {
    const userToCreate: ICreateUserDTO = {
      email: "vitor@test.com",
      name: "vitor",
      password: "1234"
    }

    const user = await createUserUseCase.execute(userToCreate)
    expect(user).toHaveProperty("id")
  })

  it("Should not be able to create an user with same email twice", async () => {
    expect(async () => {
      const userToCreate: ICreateUserDTO = {
        email: "vitor@test.com",
        name: "vitor",
        password: "1234"
      }

      const userToCreate2: ICreateUserDTO = {
        email: "vitor@test.com",
        name: "vitor hugo",
        password: "12341234"
      }

      await createUserUseCase.execute(userToCreate)
      await createUserUseCase.execute(userToCreate2)
    }).rejects.toBeInstanceOf(CreateUserError)
  })
})
