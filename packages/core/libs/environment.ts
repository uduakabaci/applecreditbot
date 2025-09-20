import { z } from "zod";

const environmentSchema = z.object({
  DATABASE_URL: z.string(),
  ENVIRONMENT: z.string().default("development"),
  TELEGRAM_BOT_TOKEN: z.string(),
});

const verifier = environmentSchema.safeParse(process.env);

if (!verifier.success) {
  console.error("❌ Invalid environment variables:", verifier.error.format());
  throw new Error("Invalid environment variables");
}

export const environment = verifier.data;
