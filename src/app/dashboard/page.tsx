"use client";
import { useEffect, useState } from "react";
import { useSession, getSession } from "next-auth/react";
import { getProfileData } from "../utils/getProfile";
import Web3 from "web3";
import { redirect } from "next/navigation";
import Image from "next/image";
import { Loader } from "lucide-react";
import { LSP3Profile } from "@lukso/lsp-factory.js";
import { toast, useToast } from "@/components/ui/use-toast";
import { simplifyImageUrl } from "../utils/simplifyImageUrl";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const { toast } = useToast();
  if (status === "unauthenticated") {
    redirect("/");
  }
  const [address, setAddress] = useState(session?.user?.name || "");
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<LSP3Profile | null>();

  useEffect(() => {
    async function getProfile() {
      try {
        const retProfileData = await getProfileData(address, false);
        if (!retProfileData) throw new Error("Profile not found");
        if (!profileData) setProfileData(retProfileData);
      } catch (error) {
        setProfileData(null);
        console.log(error);
        toast({
          title: "Connection error!",
          description: "There was an error while retrieving your profile.",
          variant: "destructive",
        });
        redirect("/");
      } finally {
        setLoading(false);
      }
    }
    getProfile();
  }, []);

  const pageContent = (
    <>
      <div className="grow bg-slate-50 rounded-lg flex flex-col lg:grid grid-cols-5 grid-rows-1">
        <div className="flex flex-col col-start-1 col-end-3">
          <Image
            src={simplifyImageUrl(profileData?.profileImage[0].url || "")}
            alt="Avatar"
            width={profileData?.profileImage[0].width}
            height={profileData?.profileImage[0].height}
            className="w-20 h-auto"
          />
          <Image
            src={simplifyImageUrl(profileData?.backgroundImage[0].url || "")}
            alt="Background"
            width={profileData?.backgroundImage[0].width}
            height={profileData?.backgroundImage[0].height}
            className="w-full h-auto"
          />
          <strong>{profileData?.name}</strong>
          <p>{profileData?.description}</p>
          <div className="flex gap-2">
            {profileData?.tags.map((tag, i) => (
              <small key={`tag-${i}`}>{tag}</small>
            ))}
          </div>
          <div className="flex flex-col gap-1">
            {profileData?.links.map((link, i) => (
              <a
                key={`link-${i}`}
                href={link.url}
                target="_blank"
                rel="noreferrer"
              >
                {link.title}
              </a>
            ))}
          </div>
        </div>
        <div className="bg-blue-100 col-start-3 col-end-6"></div>
        <hr />
        {JSON.stringify(profileData)}
      </div>
    </>
  );

  return loading ? (
    <Loader className="animate-spin text-slate-400 m-auto w-12 h-12" />
  ) : (
    pageContent
  );
}
