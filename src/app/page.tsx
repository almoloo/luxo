"use client";
import ConnectButton from "./components/ConnectButton";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  return (
    <div>
      <div>homepage</div>
      <ConnectButton />
      {session ? (
        <div>name: {session.user?.name}</div>
      ) : (
        <div>Not signed in</div>
      )}
    </div>
  );
}
