"use client";

declare global {
  interface Window {
    ethereum?: any;
  }
}

interface ErrorMessage {
  error: {
    code: number;
    message: string;
    stack: string;
  };
  id: string;
  jsonrpc: string;
}

import { signIn, signOut } from "next-auth/react";
import Web3 from "web3";
import { SiweMessage, generateNonce } from "siwe";
import { useSession } from "next-auth/react";
import { BrowserProvider } from "ethers";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { Loader2, ChevronsRight } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Link from "next/link";

export default function ConnectButton() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleConnect = async () => {
    try {
      setLoading(true);
      const web3 = new Web3(window.ethereum);
      const provider = new BrowserProvider(window.ethereum);
      await web3.eth.requestAccounts();
      const accounts = await web3.eth.getAccounts();
      const signer = await provider.getSigner();

      const message = new SiweMessage({
        domain: window.location.host,
        address: signer.address,
        statement: "Sign in with Lukso",
        uri: window.location.origin,
        version: "1",
        chainId: 42,
        resources: [
          `did:account:${signer.address}`,
          `did:web:${window.location.host}`,
        ],
        nonce: generateNonce(),
      }).prepareMessage();

      const hashedMessage = web3.eth.accounts.hashMessage(message);
      const signature = await signer.signMessage(message);

      signIn("credentials", {
        message: hashedMessage,
        signature: signature,
        account: accounts[0],
        // redirect: false,
        callbackUrl: "/dashboard",
      });
    } catch (error: ErrorMessage | any) {
      console.log(error);
      if (error.error.code === -32001) {
        setIsDialogOpen(true);
      } else {
        toast({
          title: "Connection error!",
          description: error?.error.message
            ? error?.error.message
            : "There was an error while connecting to your profile.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      setLoading(true);
      await signOut();
    } catch (error: ErrorMessage | any) {
      console.log(error);
      toast({
        title: "Error disconnecting!",
        description: error?.error.message
          ? error?.error.message
          : "There was an error while trying to disconnect.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {session ? (
        <>
          <small className="text-xs">
            {session.user?.name?.substring(0, 6)}...
            {session.user?.name?.substring(session.user?.name.length - 4)}
          </small>
          <ChevronsRight className="mr-2 h-4 w-4 text-slate-400" />
          <Button
            variant="outline"
            onClick={handleDisconnect}
            disabled={loading}
          >
            {loading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
            Disconnect
          </Button>
        </>
      ) : (
        // <button onClick={handleConnect}>connect</button>
        <Button variant="default" onClick={handleConnect} disabled={loading}>
          {loading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
          Connect Profile
        </Button>
      )}
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>No profiles found</AlertDialogTitle>
            <AlertDialogDescription>
              In order to use Luxo, you need to have a profile on the Lukso
              Mainnet network.
              <br />
              <br />
              You can create one here:
              <br />
              <Link href="https://universalprofile.cloud/">
                https://universalprofile.cloud/
              </Link>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
