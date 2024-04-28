import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { formatDistanceToNow } from "date-fns";

const Transactions = async () => {
  const session = await getServerSession(authOptions);
  // console.log(session);
  const userId = session.user.id;
  const sent = await prisma.p2pTransfer.findMany({
    where: {
      fromUserId: Number(userId),
    },
    include: {
      toUser: {
        select: {
          email: true,
        },
      },
      fromUser: {
        select: {
          email: true,
        },
      },
    },
  });

  const received = await prisma.p2pTransfer.findMany({
    where: {
      toUserId: Number(userId),
    },
    include: {
      fromUser: {
        select: {
          email: true,
        },
      },
      toUser: {
        select: {
          email: true,
        },
      },
    },
  });

  const transactions = [...received, ...sent];
  transactions.sort((a, b) =>
    new Date(b.timestamp) < new Date(a.timestamp) ? -1 : 1
  );

  console.log(transactions);
  return (
    <div className="w-full flex justify-center h-full items-center">
      <div className="border h-fit flex flex-col justify-center items-center p-4">
        <h1 className="text-2xl">Recent Transactions</h1>
        {transactions.map((transaction) => {
          return (
            <div key={transaction.id} className=" w-full flex justify-center">
              <div className="my-4 p-2">
                <div>
                  {userId == transaction.toUserId ? "+" : "-"}
                  {transaction.amount / 100}
                </div>
                <div>
                  {!(userId == transaction.fromUserId)
                    ? `From :${transaction.fromUser ? transaction.fromUser.email : "Unknown"}`
                    : `To: ${transaction.toUser ? transaction.toUser.email : "Unknown"}`}
                </div>
                <div className="text-sm text-slate-500">
                  {formatDistanceToNow(new Date(transaction.timestamp), {
                    addSuffix: true,
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Transactions;
