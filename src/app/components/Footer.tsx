import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Code2 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="flex items-center justify-between border-t pt-5 my-5">
      <small className="flex items-center">
        <Code2 className="text-slate-400 w-4 h-4 mr-1" />
        Designed and developed by
        <Link
          href="https://github.com/almoloo"
          className="hover:underline ml-1"
        >
          @almoloo
        </Link>
      </small>
      <div className="text-left">
        <small className="text-slate-400 text-xs pb-1 inline-block">
          Powered by
        </small>
        <Link href="https://lukso.network/">
          <Image
            src={"https://universalprofile.cloud/assets/images/lukso-logo.svg"}
            alt="Lukso Logo"
            width={72}
            height={17}
          />
        </Link>
      </div>
    </footer>
  );
}
