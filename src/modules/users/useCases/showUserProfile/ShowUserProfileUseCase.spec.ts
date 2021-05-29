import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository"
import { ShowUserProfileError } from "./ShowUserProfileError"
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase"

let repository: InMemoryUsersRepository
let showUserProfileUseCase: ShowUserProfileUseCase
describe("Show user profile", () => {

  beforeEach(() => {
    repository = new InMemoryUsersRepository()
    showUserProfileUseCase = new ShowUserProfileUseCase(repository)
  })

  it("Should be able to lista an user by id", async () => {
    const user = await repository.create({ email: "vitor@test.com", name: "vitor", password: "test" })

    const shown = await showUserProfileUseCase.execute(user.id as string)

    expect(user).toHaveProperty("id")
    expect(user.name).toEqual("vitor")
  })

  it("Should not be able to lista a nonexixent user by id", async () => {
    expect(async () => {
      await repository.create({ email: "vitor@test.com", name: "vitor", password: "test" })

      await showUserProfileUseCase.execute("123")
    }).rejects.toBeInstanceOf(ShowUserProfileError)

  })

})
