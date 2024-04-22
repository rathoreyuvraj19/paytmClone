import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("alice", 10);
  const alice = await prisma.user.upsert({
    where: { number: "9999999995" },
    update: {},
    create: {
      email: "9999999995",
      password: password,
      name: "alice",
      OnRampTransaction: {
        create: {
          startTime: new Date(),
          status: "Success",
          amount: 20000,
          token: "127",
          provider: "HDFC Bank",
        },
      },
      Balance: {
        create: {
          amount: 20000,
          locked: 0,
        },
      },
    },
  });

  console.log({ alice });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
