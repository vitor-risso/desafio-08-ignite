import { User } from "./src/modules/users/entities/User";
import { Statement } from "./src/modules/statements/entities/Statement";

export default {
  username: "postgres",
  password: "docker",
  name: "default",
  type: "postgres",
  host: "localhost",
  port: 5432,
  database: "fin_api",
  entities: [User, Statement],
  migrations: ["./src/database/migrations/*.ts"],
  cli: {
    entitiesDir: "./src/modules/**/entities",
    migrationsDir: "./src/database/migrations",
  },
};
