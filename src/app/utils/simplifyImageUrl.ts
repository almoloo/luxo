export const simplifyImageUrl = (url: string) => {
  if (!url) {
    return url;
  }
  if (url.startsWith("ipfs://")) {
    return url.replace("ipfs://", "https://ipfs.io/ipfs/");
  } else {
    return url;
  }
};
