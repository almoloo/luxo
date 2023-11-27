"use client";
import { useEffect, useState } from "react";
import { useSession, getSession } from "next-auth/react";
import { getProfileData } from "../utils/getProfile";
import { redirect } from "next/navigation";
import { Loader, Loader2, Save, Trash } from "lucide-react";
import { LSP3Profile } from "@lukso/lsp-factory.js";
import { toast, useToast } from "@/components/ui/use-toast";
import ProfileCard from "../components/ProfileCard";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import Web3 from "web3";
import {
  ERC725,
  ERC725JSONSchema,
  ERC725JSONSchemaKeyType,
  ERC725JSONSchemaValueContent,
  ERC725JSONSchemaValueType,
} from "@erc725/erc725.js";
import UniversalProfile from "@lukso/lsp-smart-contracts/artifacts/UniversalProfile.json";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const { toast } = useToast();
  if (status === "unauthenticated") {
    redirect("/");
  }
  const [address, setAddress] = useState(session?.user?.name || "");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [profileData, setProfileData] = useState<LSP3Profile | null>();
  const [formData, setFormData] = useState<LSP3Profile>({
    name: "",
    description: "",
    links: [],
    tags: [],
    profileImage: [],
    backgroundImage: [],
  });

  useEffect(() => {
    async function getProfile() {
      try {
        const retProfileData = await getProfileData(address, false);
        if (!retProfileData) throw new Error("Profile not found");
        if (!profileData) setProfileData(retProfileData);
        setFormData({
          name: retProfileData.name,
          description: retProfileData.description,
          links: retProfileData.links,
          tags: retProfileData.tags,
          profileImage: retProfileData.profileImage,
          backgroundImage: retProfileData.backgroundImage,
        });
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

  const uploadProfileToIPFS = async (generatedProfile: any) => {
    try {
      const response = await axios.post(
        "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        generatedProfile,
        {
          headers: {
            "Content-Type": "application/json",
            pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY,
            pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_SECRET_KEY,
          },
        }
      );
      console.log("response: ", response);
      console.log("IPFS Hash:", response.data.IpfsHash);
      return response.data.IpfsHash;
    } catch (error) {
      console.error("Failed to upload profile to Pinata IPFS:", error);
      throw error;
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const generatedProfile = {
      LSP3Profile: formData,
    };
    try {
      setSubmitting(true);

      setSubmitting(true);
      // Upload generated profile to Pinata IPFS
      const ipfsHash = await uploadProfileToIPFS(generatedProfile);
      console.log("Uploaded profile to Pinata IPFS with IPFS Hash:", ipfsHash);

      const web3 = new Web3(window.ethereum);
      const schema = [
        {
          name: "LSP3Profile",
          key: "0x5ef83ad9559033e6e941db7d7c495acdce616347d28e90c7ce47cbfcfcad3bc5",
          keyType: "Singleton" as ERC725JSONSchemaKeyType,
          valueContent: "JSONURL" as ERC725JSONSchemaValueContent,
          valueType: "bytes" as ERC725JSONSchemaValueType,
        },
      ];
      const erc725 = new ERC725(schema, address, web3.currentProvider, {
        ipfsGateway: "https://api.universalprofile.cloud/ipfs",
      });

      //   const encodedData = erc725.encodeData({
      //     keyName: 'LSP3Profile',
      //     value: {
      //       hashFunction: "keccak256(utf8)",
      //       hash: web3.utils.keccak256(JSON.stringify(formData)),
      //       url: `ipfs://${ipfsHash}`,
      //     },
      //   });

      //   const universalProfileContract = new web3.eth.Contract(
      //     UniversalProfile.abi,
      //     address
      //   );

      //   await universalProfileContract.methods
      //     .setData(encodedData.keys[0], encodedData.values[0])
      //     .send({
      //       from: address,
      //       gasLimit: 300_000,
      //     });

      setProfileData({
        ...profileData,
        ...formData,
      });
      toast({
        title: "Profile updated!",
        description: "Your profile has been updated.",
        variant: "default",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Connection error!",
        description: "There was an error while uploading your profile.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const pageContent = (
    <>
      <div className="grow rounded-lg flex flex-col lg:grid grid-cols-5 grid-rows-1 gap-5">
        <section className="flex flex-col col-start-1 col-end-3">
          <div className="p-5 border border-dashed rounded-lg bg-indigo-100/10">
            <ProfileCard profile={profileData!} address={address} />
          </div>
        </section>
        <section className="col-start-3 col-end-6">
          <form
            className="flex flex-col bg-slate-100 lg:bg-transparent rounded-lg p-4 gap-6"
            onSubmit={handleFormSubmit}
          >
            <div>
              <h2 className="font-bold mb-1">Edit Profile</h2>
              <p className="text-sm text-slate-600">
                You can edit your profile here. Your profile will be saved to
                the blockchain.
              </p>
              <div className="text-sm text-slate-600 mt-2">
                <Badge variant="outline" className="mr-2">
                  Notice
                </Badge>
                In the future, you will be able to change your profile image and
                background image.
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="border-b border-dashed w-1/3"></span>
              <h3 className="font-medium text-center grow">
                Personal Information
              </h3>
              <span className="border-b border-dashed w-1/3"></span>
            </div>
            <section className="flex flex-col gap-3">
              {/* NAME */}
              <fieldset>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  disabled={submitting}
                />
              </fieldset>
              {/* DESCRIPTION */}
              <fieldset>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  disabled={submitting}
                />
              </fieldset>
            </section>
            {/* LINKS */}
            <div className="flex items-center gap-4">
              <span className="border-b border-dashed w-1/3"></span>
              <h3 className="font-medium text-center grow">Links</h3>
              <span className="border-b border-dashed w-1/3"></span>
            </div>
            <section className="flex flex-col gap-4">
              {formData.links && formData.links.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {formData.links.map((link, index) => (
                    <div className="flex items-end gap-4" key={`link-${index}`}>
                      <fieldset className="flex-1">
                        <Label htmlFor={`link-title-${index}`}>Title</Label>
                        <Input
                          id={`link-title-${index}`}
                          value={link.title}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              links: [
                                ...formData.links!,
                                { title: e.target.value, url: link.url },
                              ],
                            })
                          }
                          disabled={submitting}
                        />
                      </fieldset>
                      <fieldset className="flex-1">
                        <Label htmlFor={`link-url-${index}`}>URL</Label>
                        <Input
                          id={`link-url-${index}`}
                          value={link.url}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              links: [
                                ...formData.links!,
                                { title: link.title, url: e.target.value },
                              ],
                            })
                          }
                          disabled={submitting}
                        />
                      </fieldset>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            links: formData.links?.filter(
                              (_, i) => i !== index
                            ),
                          });
                        }}
                        disabled={submitting}
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-600">
                  You can add links to your profile here
                </p>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setFormData({
                    ...formData,
                    links: [...formData.links!, { title: "", url: "" }],
                  })
                }
                disabled={submitting}
              >
                Add Link
              </Button>
            </section>
            <div className="flex items-center gap-4">
              <span className="border-b border-dashed w-1/3"></span>
              <h3 className="font-medium text-center grow">Tags</h3>
              <span className="border-b border-dashed w-1/3"></span>
            </div>
            {/* TAGS */}
            <section className="flex flex-col gap-4">
              {formData.tags && formData.tags.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {formData.tags.map((tag, index) => (
                    <div
                      className="flex items-center gap-4"
                      key={`tag-${index}`}
                    >
                      <Input
                        id={`tag-${index}`}
                        value={tag}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            tags: [...(formData.tags || []), e.target.value],
                          })
                        }
                        disabled={submitting}
                      />
                      <Button
                        variant="outline"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            tags: (formData.tags || []).filter(
                              (_, i) => i !== index
                            ),
                          });
                        }}
                        disabled={submitting}
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-600">
                  You can add tags to your profile here
                </p>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setFormData({ ...formData, tags: [...formData.tags!, ""] })
                }
                disabled={submitting}
              >
                Add Tag
              </Button>
            </section>
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Profile
            </Button>
          </form>
        </section>
      </div>
    </>
  );

  return loading ? (
    <Loader className="animate-spin text-slate-400 m-auto w-12 h-12" />
  ) : (
    pageContent
  );
}
