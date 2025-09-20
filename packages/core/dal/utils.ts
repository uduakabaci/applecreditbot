import { ulid } from "ulid";

export const prefixes = {
  user: "usr",
  order: "ord",
} as const;

export function createID(prefix: keyof typeof prefixes): string {
  return [prefixes[prefix], ulid()].join("_");
}
