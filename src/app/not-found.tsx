import Link from "next/link";
import { Frown, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="m-auto">
      <div className="flex gap-4">
        <Frown className="w-8 h-8 text-slate-400" />
        <div className="pl-5 border-l">
          <h2 className="font-mono text-lg font-bold mb-2">404 Not Found</h2>
          <p className="text-sm mb-5">
            The page you are looking for does not exist.
            <br />
            Please check the URL and try again.
          </p>
          <Link href="/">
            <Button variant="outline">
              <Home className="mr-2 h-4 w-4" />
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
