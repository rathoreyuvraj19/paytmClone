import prisma from "@repo/db/client";

import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { BalanceCard } from "../../components/BalanceCard";
import { OnRampTransactions } from "../../components/OnRampTransaction";
import { AddMoney } from "../../components/AddMoneyCard";

async function getBalance() {
  const session = await getServerSession(authOptions);
  const balance = await prisma.balance.findFirst({
    where: {
      userId: Number(session?.user?.id),
    },
  });
  // console.log(session);
  return {
    amount: balance?.amount || 0,
    locked: balance?.locked || 0,
  };
}

async function getOnRampTransactions() {
  const session = await getServerSession(authOptions);
  const txns = await prisma.onRampTransaction.findMany({
    where: {
      userId: Number(session?.user?.id),
    },
  });
  console.log(txns);
  return txns.map((t) => ({
    time: t.startTime,
    amount: t.amount,
    status: t.status,
    provider: t.provider,
  }));
}

export default async function () {
  const balance = await getBalance();
  const transaction = await getOnRampTransactions();
  console.log(transaction);
  return (
    <div className="w-screen">
      <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
        Transfer
      </div>

      <div className="grid md:grid-cols-2 gap-4 grid-cols-1 p-4">
        <div>
          <AddMoney></AddMoney>
        </div>
        <div>
          <BalanceCard
            amount={balance.amount}
            locked={balance.locked}
          ></BalanceCard>
          <div className="pt-4">
            <OnRampTransactions transactions={transaction}></OnRampTransactions>
          </div>
        </div>
      </div>
    </div>
  );
}
