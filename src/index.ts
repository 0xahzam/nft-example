import logger from "./logger";

type PinataResponse = {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
};

const PINATA_JWT = Bun.env.PINATA_JWT ?? "";

const pinataHeaders = {
  Authorization: `Bearer ${PINATA_JWT}`,
};

async function uploadImageUrlToIPFS(imageUrl: string): Promise<string> {
  try {
    const urlStream = await fetch(imageUrl);
    const arrayBuffer = await urlStream.arrayBuffer();
    const blob = new Blob([arrayBuffer]);
    const file = new File([blob], "image.jpg");

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      {
        method: "POST",
        headers: pinataHeaders,
        body: formData,
      }
    );

    if (!response.ok) {
      logger.error("Failed pushing image to IPFS");
      throw new Error(`Upload failed with status: ${response.status}`);
    }

    logger.info("Pushed image to IPFS");

    const data = (await response.json()) as PinataResponse;

    logger.info(`IPFS Hash :: ${data.IpfsHash}`);
    logger.info(`IPFS :: ipfs://${data.IpfsHash}`);
    logger.info(`HTTPs :: https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`);
    return `ipfs://${data.IpfsHash}`;
  } catch (error) {
    logger.error("Error uploading image to IPFS:", error);
    throw error;
  }
}

async function uploadMetadataToIPFS(
  imageIpfsUrl: string,
  name: string,
  description: string
): Promise<string> {
  try {
    const metadata = {
      name,
      description,
      image: imageIpfsUrl,
    };

    const response = await fetch(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      {
        method: "POST",
        headers: {
          ...pinataHeaders,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(metadata),
      }
    );

    if (!response.ok) {
      logger.error("Failed pushing image to IPFS");
      throw new Error(`Metadata upload failed with status: ${response.status}`);
    }

    const data = (await response.json()) as PinataResponse;

    logger.info(`IPFS Hash :: ${data.IpfsHash}`);
    logger.info(`IPFS :: ipfs://${data.IpfsHash}`);
    logger.info(`HTTPs :: https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`);

    return `ipfs://${data.IpfsHash}`;
  } catch (error) {
    console.error("Error uploading metadata to IPFS:", error);
    throw error;
  }
}

async function main() {
  const imageUrl =
    "https://images.prismic.io/igspace/5f77bbf6-9b55-4202-a5f5-8bf185388955_aircraft-g463fcda57_1920.jpg";

  try {
    const imageIpfsUrl = await uploadImageUrlToIPFS(imageUrl);

    await uploadMetadataToIPFS(
      imageIpfsUrl,
      "Pixel Knight #1",
      "A mighty pixel warrior"
    );
  } catch (error) {
    logger.error("Error in main:", error);
    throw error;
  }
}

await main();
