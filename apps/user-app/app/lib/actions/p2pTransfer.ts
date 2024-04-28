"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";

export async function P2Ptransfer(recieverMail: string, amount: number) {
  const session = await getServerSession(authOptions);

  const SendersId = session.user.id;
  const reciever = await prisma.user.findFirst({
    where: {
      email: recieverMail,
    },
  });
  if (!reciever) {
    return {
      message: "User Does NOT exist",
    };
  }

  try {
    await prisma.$transaction(async (tx) => {
      const sender = await tx.balance.findUnique({
        where: {
          userId: Number(SendersId),
        },
      });
      await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${Number(sender?.userId)} FOR UPDATE`; // Added to lock the row before a transaction

      if (!sender) {
        throw new Error("Some error occucured");
      }
      if (sender?.amount < amount) {
        throw new Error("Insufficent balance");
      }

      const res = await tx.balance.update({
        where: {
          userId: Number(sender.userId),
        },
        data: {
          amount: {
            decrement: amount,
          },
        },
      });
      await tx.balance.update({
        where: {
          userId: Number(reciever.id),
        },
        data: {
          amount: {
            increment: amount,
          },
        },
      });

      const transaction = await tx.p2pTransfer.create({
        data: {
          amount: amount,
          fromUserId: Number(sender.userId),
          toUserId: Number(reciever.id),
          timestamp: new Date(),
        },
      });
    });
  } catch (error) {
    console.log(error);
    return { message: "Some Error Occured" };
  }
}
