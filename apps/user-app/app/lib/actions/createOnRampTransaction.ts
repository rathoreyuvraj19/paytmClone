"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";
import { v4 as uuidv4 } from "uuid";

export async function CreateOnRampTransaction(
  amount: number,
  provider: string
) {
  const token = uuidv4();

  const session = await getServerSession(authOptions);
  const userId = session.user.id;
  if (!session?.user || !session.user?.id) {
    return {
      message: "Unauthenticated request",
    };
  }

  const res = await prisma.onRampTransaction.create({
    data: {
      amount,
      userId: Number(userId),
      token,
      startTime: new Date(),
      provider,
      status: "Processing",
    },
  });
  return {
    message: "Done",
  };
}
