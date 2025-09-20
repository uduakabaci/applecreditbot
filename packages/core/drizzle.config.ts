import { defineConfig } from "drizzle-kit"
import { environment } from "./libs/environment";

export default defineConfig({
  schema: "./dal/**/*.sql.ts",
  out: "./migrations",
  dialect: "sqlite",
  dbCredentials: {
    url: environment.DATABASE_URL
  },
})
