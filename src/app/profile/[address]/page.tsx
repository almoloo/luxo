"use client";

import { getProfileData } from "@/app/utils/getProfile";
import { LSP3Profile } from "@lukso/lsp-factory.js";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { notFound, redirect } from "next/navigation";
import ProfileCard from "@/app/components/ProfileCard";
import { useSession } from "next-auth/react";
import Link from "next/link";

type Props = {
  params: {
    address: string;
  };
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export default function Page(props: Props) {
  const { data: session, status } = useSession();
  const { address } = props.params;
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<LSP3Profile | null>();

  useEffect(() => {
    async function getProfile() {
      try {
        const retProfileData = await getProfileData(address, false);
        if (!retProfileData) throw new Error("Profile not found");
        setProfileData(retProfileData);
      } catch (error) {
        console.log(error);
        redirect("/not-found");
      } finally {
        setLoading(false);
      }
    }
    getProfile();
    () => {
      setLoading(true);
      setProfileData(null);
    };
  }, []);

  return loading ? (
    <Loader className="animate-spin text-slate-400 m-auto w-12 h-12" />
  ) : (
    <div className="w-full md:w-2/3 lg:w-1/2 mx-auto">
      {status === "authenticated" && session.user?.name === address && (
        <div className="mb-4 border border-dashed rounded-lg p-4">
          <p className="text-sm text-slate-400 mb-2">
            You can use this URL to share your profile with others:
          </p>
          <Link href={`/profile/${address}`} className="text-xs break-all">
            {`${process.env.NEXT_PUBLIC_URL}/profile/${address}`}
          </Link>
        </div>
      )}
      <ProfileCard profile={profileData!} address={address} />
    </div>
  );
}
