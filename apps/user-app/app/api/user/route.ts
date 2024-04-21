import { PrismaClient } from "@repo/db/client";
import { NextResponse } from "next/server";

const client = new PrismaClient();

export const GET = async () => {
  await client.user.create({
    data: {
      email: "rathore.yuvraj19@gmail.com",
      name: "yuvraj",
    },
  });

  return NextResponse.json({
    message: "Hi there",
  });
};
