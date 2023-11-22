"use client";

declare global {
  interface Window {
    ethereum?: any;
  }
}

import { signIn, signOut } from "next-auth/react";
import Web3 from "web3";
// import UniversalProfileContract from "@lukso/lsp-smart-contracts/artifacts/UniversalProfile.json";
import { SiweMessage, generateNonce } from "siwe";
import { useSession } from "next-auth/react";
import { BrowserProvider } from "ethers";

const handleConnect = async () => {
  try {
    const web3 = new Web3(window.ethereum);
    const provider = new BrowserProvider(window.ethereum);
    await web3.eth.requestAccounts();
    const accounts = await web3.eth.getAccounts();
    const signer = await provider.getSigner();

    // const myUniversalProfileContract = new web3.eth.Contract(
    //   UniversalProfileContract.abi,
    //   signer.address
    // );

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

    // const isValidSignature: string = await myUniversalProfileContract.methods
    //   .isValidSignature(hashedMessage, signature)
    //   .call();

    // if (isValidSignature === "0x1626ba7e") {
    signIn("credentials", {
      message: hashedMessage,
      signature: signature,
      account: accounts[0],
      redirect: false,
      callbackUrl: "/",
    });
    // }
  } catch (error) {
    console.log(error);
  }
};

const handleDisconnect = async () => {
  await signOut();
};

export default function ConnectButton() {
  const { data: session } = useSession();
  return (
    <>
      {session ? (
        <>
          <p>{session.user?.name}</p>
          <button onClick={handleDisconnect}>disconnect</button>
        </>
      ) : (
        <button onClick={handleConnect}>connect</button>
      )}
    </>
  );
}
