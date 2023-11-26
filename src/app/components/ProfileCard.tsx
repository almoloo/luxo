import { LSP3Profile } from "@lukso/lsp-factory.js";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

import { simplifyImageUrl } from "@/app/utils/simplifyImageUrl";
import { Copy, ExternalLink, Wallet } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast, useToast } from "@/components/ui/use-toast";
import Link from "next/link";

interface Props {
  profile: LSP3Profile;
  address: string;
}

export default function ProfileCard(props: Props) {
  const { profile, address } = props;
  const { toast } = useToast();

  const copyHandler = async () => {
    try {
      await navigator.clipboard.writeText(address);
      toast({
        title: "Success",
        description: "Copied address to clipboard",
        variant: "default",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Failed to copy address",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full flex flex-col gap-5">
      <section>
        {profile?.backgroundImage !== undefined &&
          profile?.backgroundImage.length > 0 && (
            <Image
              src={simplifyImageUrl(profile?.backgroundImage[0].url || "")}
              alt="background"
              width={profile.backgroundImage[0].width}
              height={profile.backgroundImage[0].height}
              className="rounded-t-lg w-full h-48 object-cover"
            />
          )}
        <div className="flex items-start bg-slate-100 w-full rounded-b-lg p-4 gap-5">
          <Image
            src={simplifyImageUrl(
              profile?.profileImage !== undefined &&
                profile?.profileImage.length > 0
                ? profile?.profileImage[0].url
                : ""
            )}
            alt="Avatar"
            width={90}
            height={90}
            className={`rounded-lg shrink-0 ${
              profile?.backgroundImage !== undefined &&
              profile?.backgroundImage.length > 0 &&
              "relative -mt-4 top-[-45px] shadow-lg z-10"
            }`}
          />
          <div>
            {profile?.name ? (
              <strong className="text-lg">{profile?.name}</strong>
            ) : (
              <strong className="text-lg">[Unnamed]</strong>
            )}
            {profile?.description && (
              <p className="text-sm text-slate-600 mt-1">
                {profile?.description}
              </p>
            )}
            {profile?.tags && profile.tags.length > 0 && (
              <div className="flex gap-1 mt-2">
                {profile.tags.map((tag, index) => (
                  <Badge key={`tag-${index}`} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
      {profile.links && profile.links?.length > 0 && (
        <section className="flex flex-col gap-2">
          {profile.links.map((link, index) => (
            // <span>
            //   {link.title} - {link.url}
            // </span>
            <Link href={link.url} target="_blank" key={`link-${index}`}>
              <Button
                variant="outline"
                className="w-full flex justify-between h-14"
              >
                <span className="flex flex-col items-start py-3">
                  <strong>{link.title}</strong>
                  <small>{link.url}</small>
                </span>
                <ExternalLink className="w-4 h-4 text-slate-500" />
              </Button>
            </Link>
          ))}
        </section>
      )}
      <section className="bg-indigo-100 rounded-lg p-4 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <Wallet className="text-indigo-400" />
          <strong className="text-indigo-700">Donate LYX</strong>
        </div>
        <p className="text-sm text-slate-600">
          Use this address to donate LUKSO and support this person.
        </p>
        <div className="flex space-x-2">
          <Input value={address} readOnly />
          <Button variant="outline" color="inherit" onClick={copyHandler}>
            <Copy className="w-4 h-4" />
          </Button>
        </div>
      </section>
    </div>
  );
}
