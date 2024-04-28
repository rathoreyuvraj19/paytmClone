"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function () {
  const session = useSession();
  const router = useRouter();
  if (session.status === "unauthenticated") {
    router.push("/api/auth/signin");
  }
  return <div>Dashboard Page </div>;
}
