interface SuperUser extends User {
  account: string;
}
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { User } from "next-auth";
import { createPublicClient, http, getContract, getAddress } from "viem";
import { lukso } from "viem/chains";
import UniversalProfileContract from "@lukso/lsp-smart-contracts/artifacts/UniversalProfile.json";

const client = createPublicClient({
  chain: lukso,
  transport: http(),
});

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Lukso",
      credentials: {
        message: {
          label: "Message",
          type: "text",
        },
        signature: {
          label: "Signature",
          type: "text",
        },
        account: {
          label: "account",
          type: "text",
        },
      },
      async authorize(credentials) {
        try {
          const contract = getContract({
            abi: UniversalProfileContract.abi,
            address: getAddress(credentials?.account || "0x"),
            publicClient: client,
          });

          const isValidSignature = await contract.read.isValidSignature([
            credentials?.message,
            credentials?.signature,
          ]);

          if (isValidSignature === "0x1626ba7e") {
            return {
              account: credentials?.account,
              signature: credentials?.signature,
            };
          }
          return null;
        } catch (error) {
          console.error(error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/",
  },
  callbacks: {
    async jwt({ token, user, session, account, profile }) {
      const extendedUser = user as SuperUser;
      if (extendedUser?.account) {
        token.name = extendedUser.account;
      }
      return token;
    },
  },
};
