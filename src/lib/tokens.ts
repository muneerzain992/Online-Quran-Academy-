import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";

export function createRawToken() {
  return randomBytes(32).toString("hex");
}

export async function storeVerificationToken(
  identifier: string,
  token: string,
  hoursValid = 24,
) {
  const expires = new Date(Date.now() + hoursValid * 60 * 60 * 1000);
  await prisma.verificationToken.deleteMany({ where: { identifier } });
  await prisma.verificationToken.create({
    data: { identifier, token, expires },
  });
  return expires;
}

export async function consumeVerificationToken(
  identifier: string,
  token: string,
) {
  const record = await prisma.verificationToken.findUnique({
    where: {
      identifier_token: { identifier, token },
    },
  });
  if (!record || record.expires < new Date()) {
    return false;
  }
  await prisma.verificationToken.delete({
    where: { identifier_token: { identifier, token } },
  });
  return true;
}
