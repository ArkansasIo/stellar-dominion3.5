import bcrypt from "bcrypt";
import { createHash, timingSafeEqual } from "crypto";

const BCRYPT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

function isLegacySha256Hash(value: string): boolean {
  return /^[a-f0-9]{64}$/i.test(value);
}

function verifyLegacySha256(password: string, storedHash: string): boolean {
  const candidate = createHash("sha256").update(password).digest("hex");
  const expected = Buffer.from(storedHash, "utf8");
  const actual = Buffer.from(candidate, "utf8");
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export async function verifyPassword(password: string, storedHash: string | null | undefined): Promise<boolean> {
  if (!password || !storedHash) return false;

  if (storedHash.startsWith("$2a$") || storedHash.startsWith("$2b$") || storedHash.startsWith("$2y$")) {
    return bcrypt.compare(password, storedHash);
  }

  return isLegacySha256Hash(storedHash) && verifyLegacySha256(password, storedHash);
}

export function needsPasswordRehash(storedHash: string | null | undefined): boolean {
  return Boolean(storedHash && isLegacySha256Hash(storedHash));
}
