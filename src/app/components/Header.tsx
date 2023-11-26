import Link from "next/link";
import ConnectButton from "./ConnectButton";

export default function Header() {
  return (
    <header className="border rounded-lg flex items-center justify-between p-3 my-3">
      <Link
        href="/"
        className="bg-yellow-300 text-black px-3 py-2 rounded-sm tracking-tighter"
      >
        <strong>LUXO_</strong>
      </Link>
      <div className="flex items-center gap-2">
        <ConnectButton />
      </div>
    </header>
  );
}
