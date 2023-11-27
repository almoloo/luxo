import { ERC725, ERC725JSONSchema } from "@erc725/erc725.js";
import lsp3ProfileSchema from "@erc725/erc725.js/schemas/LSP3ProfileMetadata.json" assert { type: "json" };
import { Address } from "web3";
import { rpcNetwork } from "./getRPC";
import { LSP3Profile } from "@lukso/lsp-factory.js";

/**
 * Retrieves profile data for a given address.
 *
 * @param {Address} address - The address for which to retrieve the profile data.
 * @param {boolean} isTestnet - (optional) Indicates whether the address belongs to a testnet. Defaults to false.
 * @return {Promise<any>} A promise that resolves to the profile data.
 */
export const getProfileData = async (
  address: Address,
  isTestnet: boolean = false
) => {
  try {
    const erc725 = new ERC725(
      lsp3ProfileSchema as ERC725JSONSchema[],
      address,
      rpcNetwork(isTestnet),
      {
        ipfsGateway: "https://api.universalprofile.cloud/ipfs",
      }
    );

    const profileData: any = (await erc725.fetchData("LSP3Profile")).value; //?.LSP3Profile;
    if (profileData.LSP3Profile) {
      return profileData as LSP3Profile;
    } else {
      return {
        description: "",
        name: "",
        backgroundImage: [],
        links: [],
        profileImage: [],
        tags: [],
      } as LSP3Profile;
    }
  } catch (error) {
    return null;
  }
};
