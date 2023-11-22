import NextAuth from "next-auth";
import { authOptions } from "@/app/utils/authOptions";

async function auth(req: any, res: any) {
  return await NextAuth(req, res, authOptions);
}

export { auth as GET, auth as POST };
