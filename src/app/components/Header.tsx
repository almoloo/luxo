"use client";
import Link from "next/link";
import ConnectButton from "./ConnectButton";
import { useSession } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();
  return (
    <header className="border rounded-lg flex items-center justify-between p-3 my-3">
      <div className="flex items-center gap-5">
        <Link
          href="/"
          className="bg-yellow-300 text-black px-3 py-2 rounded-sm tracking-tighter"
        >
          <strong>LUXO_</strong>
        </Link>
        {session && (
          <>
            <Link href="/dashboard" className="text-sm">
              Edit Profile
            </Link>
            <Link href={`/profile/${session.user?.name}`} className="text-sm">
              View Profile
            </Link>
          </>
        )}
      </div>
      <div className="flex items-center gap-2">
        <ConnectButton />
      </div>
    </header>
  );
}
